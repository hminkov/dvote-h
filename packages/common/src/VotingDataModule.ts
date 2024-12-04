import { Module, TypeOrmBootstrap } from '@nestjs/common'
import { VoteRepository, UserRepository, ElectionRepository } from './repositories'
import { Vote, User, Election } from './models'

export const MIGRATIONS_PATH = __dirname

@Module({
  imports: [],
  providers: [
    ...TypeOrmBootstrap({
      repositories: [
        {
          repository: UserRepository as any,
          entity: User,
        },
        {
          repository: VoteRepository as any,
          entity: Vote,
        },
        {
          repository: ElectionRepository as any,
          entity: Election,
        },
      ],
    }),
  ],
  exports: [UserRepository, VoteRepository, ElectionRepository],
})
export class VotingDataModule {}
