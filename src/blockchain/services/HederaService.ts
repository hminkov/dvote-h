import { Injectable } from '@nestjs/common'
import {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  Status,
  TransactionId,
  TransactionReceiptQuery,
} from '@hashgraph/sdk'
import { Party } from '../../types/Party'
import { TransactionVerification } from '../../types/TransactionVerification'
import { StoredVote } from '../../types/StoredVote'
@Injectable()
export class HederaService {
  private client: Client
  private operatorId: string
  private operatorKey: string
  private parties: Map<string, Party>
  private messageLog: Map<string, string>
  private votes: StoredVote[] = []
  private electionTopicId: string | null = null

  constructor() {
    this.operatorId = 'HEDERA_ACCOUNT_ID'
    this.operatorKey = 'HEDERA_PRIVATE_KEY'

    this.client = Client.forTestnet()

    this.client.setOperator(AccountId.fromString(this.operatorId), PrivateKey.fromString(this.operatorKey))

    this.parties = new Map<string, Party>([
      ['GERB', { name: 'GERB', votes: 0 }],
      ['PP', { name: 'Continuing the change(PP)', votes: 0 }],
      ['REV', { name: 'Revolution', votes: 0 }],
    ])

    this.messageLog = new Map<string, string>()
  }

  async createTopic(): Promise<string> {
    try {
      const transaction = new TopicCreateTransaction()
      const txResponse = await transaction.execute(this.client)
      const receipt = await txResponse.getReceipt(this.client)
      const topicId = receipt.topicId
      return topicId.toString()
    } catch (error) {
      throw new Error(`Error creating topic: ${error.message}`)
    }
  }

  async initializeElection(): Promise<{
    electionTopicId: string
    parties: Party[]
  }> {
    try {
      // Reset state
      this.votes = []

      // Create main election topic
      const electionTopic = await this.createTopic()
      this.electionTopicId = electionTopic

      console.log('Created main election topic:', this.electionTopicId)

      // Create topic for each party
      for (const [partyId, party] of this.parties) {
        const topicId = await this.createTopic()

        // Generate party keys
        const privateKey = PrivateKey.generateED25519()
        const publicKey = privateKey.publicKey

        this.parties.set(partyId, {
          ...party,
          topicId,
          privateKey: privateKey.toString(),
          publicKey: publicKey.toString(),
          votes: 0,
        })

        console.log(`Initialized party ${partyId}:`, this.parties.get(partyId))
      }

      console.log('All parties after initialization:', Array.from(this.parties.entries()))

      return {
        electionTopicId: this.electionTopicId,
        parties: Array.from(this.parties.values()),
      }
    } catch (error) {
      console.error('Error in initializeElection:', error)
      throw new Error(`Error initializing election: ${error.message}`)
    }
  }

  async submitVote(
    partyId: string,
    voteData: any,
  ): Promise<{
    mainTransactionId: string
    partyTransactionId: string
  }> {
    if (!this.electionTopicId) {
      throw new Error('Election not initialized')
    }

    const party = this.parties.get(partyId)
    if (!party || !party.topicId) {
      throw new Error(`Invalid party or party not initialized: ${partyId}`)
    }

    try {
      const cleanVoteData = {
        voterId: voteData.voterId,
        partyChoice: voteData.partyChoice,
        location: voteData.location,
        timestamp: new Date().toISOString(),
      }

      const mainTransactionId = await this.submitMessage(this.electionTopicId, cleanVoteData)

      const partyTransactionId = await this.submitMessage(party.topicId, cleanVoteData)

      party.votes = (party.votes || 0) + 1
      this.parties.set(partyId, party)

      this.votes.push({
        ...cleanVoteData,
        timestamp: new Date(cleanVoteData.timestamp),
        transactionId: mainTransactionId,
      })

      return {
        mainTransactionId,
        partyTransactionId,
      }
    } catch (error) {
      throw new Error(`Error submitting vote: ${error.message}`)
    }
  }

  getAllVotes(): any {
    const voteCounts = Object.fromEntries(
      Array.from(this.parties.entries()).map(([partyId, party]) => [
        partyId,
        {
          name: party.name,
          votes: party.votes || 0,
          topicId: party.topicId,
        },
      ]),
    )

    const totalVotes = this.votes.length

    const results = Object.entries(voteCounts).map(([partyId, data]) => ({
      partyId,
      name: data.name,
      votes: data.votes,
      topicId: data.topicId,
      percentage: totalVotes > 0 ? ((data.votes / totalVotes) * 100).toFixed(2) + '%' : '0%',
    }))

    return {
      totalVotes,
      results,
      votesList: this.votes.map((vote) => ({
        voterId: vote.voterId,
        partyChoice: vote.partyChoice,
        location: vote.location,
        timestamp: vote.timestamp,
        transactionId: vote.transactionId,
      })),
    }
  }

  async verifyTransaction(transactionId: string): Promise<TransactionVerification> {
    try {
      const receipt = await new TransactionReceiptQuery().setTransactionId(TransactionId.fromString(transactionId)).execute(this.client)

      const isValid = receipt.status === Status.Success

      // Find the vote details from our stored votes
      const voteDetails = this.votes.find((v) => v.transactionId === transactionId)

      return {
        isValid,
        transactionId,
        vote: voteDetails
          ? {
              voterId: voteDetails.voterId,
              partyChoice: voteDetails.partyChoice,
              location: voteDetails.location,
              timestamp: voteDetails.timestamp,
            }
          : undefined,
      }
    } catch (error) {
      throw new Error(`Error verifying transaction: ${error.message}`)
    }
  }

  async submitMessage(topicId: string, message: any): Promise<string> {
    try {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message)

      const transaction = new TopicMessageSubmitTransaction().setTopicId(topicId).setMessage(messageString)

      const txResponse = await transaction.execute(this.client)
      const transactionId = txResponse.transactionId.toString()

      return transactionId
    } catch (error) {
      throw new Error(`Error submitting message: ${error.message}`)
    }
  }
}
