import { Repository } from 'typeorm'
import { User } from '../models'

export class UserRepository extends Repository<User> {
  async findByNationalId(nationalId: string): Promise<User | undefined> {
    return this.findOne({ where: { nationalId } })
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } })
  }

  async checkIfUserHasVoted(userId: string, electionId: string): Promise<boolean> {
    const count = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.votes', 'vote')
      .where('user.id = :userId', { userId })
      .andWhere('vote.electionId = :electionId', { electionId })
      .getCount()

    return count > 0
  }
}
