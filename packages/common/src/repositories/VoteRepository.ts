import { Repository } from 'typeorm'
import { Vote } from '../models/Vote.entity'

export class VoteRepository extends Repository<Vote> {
  async findByTransactionId(transactionId: string): Promise<Vote | undefined> {
    return this.findOne({
      where: { transactionId },
      relations: ['user', 'election'],
    })
  }

  async getVotesByElection(electionId: string): Promise<Vote[]> {
    return this.find({
      where: { election: { id: electionId } },
      relations: ['user'],
    })
  }

  async getVotesByUser(userId: string): Promise<Vote[]> {
    return this.find({
      where: { user: { id: userId } },
      relations: ['election'],
    })
  }
}
