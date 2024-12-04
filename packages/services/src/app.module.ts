import { Module } from '@nestjs/common'
import { HederaModule } from './blockchain/HederaModule'
import { VoteModule } from './modules/vote/VoteModule'

@Module({
  imports: [HederaModule, VoteModule],
})
export class AppModule {}
