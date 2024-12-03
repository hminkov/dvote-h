import { Module } from '@nestjs/common'
import { VoteController } from '../../blockchain/controllers/VoteController'
import { VoteService } from './VoteService'
import { HederaModule } from '../../blockchain/HederaModule'

@Module({
  imports: [HederaModule],
  controllers: [VoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
