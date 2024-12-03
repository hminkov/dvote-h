import { Injectable, BadRequestException } from '@nestjs/common'
import { HederaService } from '../../blockchain/services/HederaService'
import { VoteData } from '../../types/VoteData'
import { TransactionVerification } from '../../types/TransactionVerification'

@Injectable()
export class VoteService {
  private electionTopicId: string | null = null

  constructor(private readonly hederaService: HederaService) {}

  async initializeElection() {
    try {
      const result = await this.hederaService.initializeElection()
      this.electionTopicId = result.electionTopicId
      return result
    } catch (error) {
      throw new BadRequestException('Failed to initialize election: ' + error.message)
    }
  }

  async castVote(voterData: VoteData): Promise<{
    transactionId: string
    timestamp: Date
  }> {
    if (!this.electionTopicId) {
      throw new BadRequestException('Election not initialized. Please initialize first.')
    }

    try {
      const { mainTransactionId } = await this.hederaService.submitVote(voterData.partyChoice, voterData)

      return {
        transactionId: mainTransactionId,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new BadRequestException(`Failed to cast vote: ${error.message}`)
    }
  }

  async verifyVote(transactionId: string): Promise<TransactionVerification> {
    try {
      return await this.hederaService.verifyTransaction(transactionId)
    } catch (error) {
      throw new BadRequestException(`Failed to verify vote: ${error.message}`)
    }
  }

  async getAllVotes() {
    try {
      return await this.hederaService.getAllVotes()
    } catch (error) {
      throw new BadRequestException(`Failed to get votes: ${error.message}`)
    }
  }

  getElectionTopicId(): string | null {
    return this.electionTopicId
  }
}
