import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { HederaService } from '../services/HederaService'

@Controller('hedera')
export class HederaController {
  constructor(private readonly hederaService: HederaService) {}

  @Get('ping')
  ping() {
    return { status: 'success', message: 'Server is responding' }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      message: 'Hedera service is running',
    }
  }

  @Post('initialize')
  async initializeElection() {
    try {
      const result = await this.hederaService.initializeElection()
      return {
        success: true,
        data: result,
        message: 'Election initialized with party wallets',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  @Post('message')
  async submitMessage(@Body() body: { topicId: string; message: string }) {
    try {
      const transactionId = await this.hederaService.submitMessage(body.topicId, body.message)
      return {
        success: true,
        data: {
          transactionId,
          topicId: body.topicId,
          message: body.message,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  @Get('test')
  async testConnection() {
    try {
      const operator = {
        id: this.hederaService.getOperatorId(),
        network: 'testnet',
      }

      const isConnected = await this.hederaService.testConnection()

      return {
        status: isConnected ? 'success' : 'failed',
        operator,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        details: error.stack,
      }
    }
  }

  @Get('verify/:transactionId')
  async verifyTransaction(@Param('transactionId') transactionId: string) {
    try {
      const isValid = await this.hederaService.verifyTransaction(transactionId)
      return {
        success: true,
        data: {
          transactionId,
          isValid,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  @Get('parties')
  async getParties() {
    try {
      const votes = await this.hederaService.getAllVotes()
      return {
        success: true,
        data: votes,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}
