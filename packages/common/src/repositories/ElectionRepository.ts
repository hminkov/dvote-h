import { Repository } from 'typeorm'
import { Election } from '../models/'

export class ElectionRepository extends Repository<Election> {
  async findByTopicId(topicId: string): Promise<Election | undefined> {
    return this.findOne({ where: { topicId } })
  }

  async getActiveElections(): Promise<Election[]> {
    return this.find({
      where: { isActive: true },
      relations: ['votes'],
    })
  }

  async getElectionResults(electionId: string): Promise<any> {
    const election = await this.findOne({
      where: { id: electionId },
      relations: ['votes'],
    })

    if (!election) {
      return null
    }

    // Group votes by party
    const results = election.votes.reduce((acc, vote) => {
      acc[vote.partyChoice] = (acc[vote.partyChoice] || 0) + 1
      return acc
    }, {})

    return {
      electionId: election.id,
      topicId: election.topicId,
      totalVotes: election.votes.length,
      results,
    }
  }
}
