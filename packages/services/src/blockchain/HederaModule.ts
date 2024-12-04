import { Module } from '@nestjs/common'
import { HederaController } from './controllers/HederaController'
import { HederaService } from './services/HederaService'

@Module({
  controllers: [HederaController],
  providers: [HederaService],
  exports: [HederaService],
})
export class HederaModule {}
