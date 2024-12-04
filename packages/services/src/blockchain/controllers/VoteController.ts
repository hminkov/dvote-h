import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { VoteService } from '../../modules/vote/VoteService'
import { VoteData } from '../../types/VoteData'

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post('initialize')
  async initializeElection() {
    const result = await this.voteService.initializeElection()
    return {
      status: 'success',
      data: {
        electionTopicId: result.electionTopicId,
        parties: result.parties,
      },
      message: 'Election initialized successfully',
    }
  }

  @Post('cast')
  async castVote(@Body() voteData: VoteData) {
    const result = await this.voteService.castVote(voteData)
    return {
      status: 'success',
      ...result,
      message: 'Vote cast successfully',
    }
  }

  @Get('verify/:transactionId')
  async verifyVote(@Param('transactionId') transactionId: string) {
    const verification = await this.voteService.verifyVote(transactionId)
    return {
      status: 'success',
      verification,
      message: 'Vote verification completed',
    }
  }

  @Get('results')
  async getResults() {
    const results = await this.voteService.getAllVotes()
    return {
      status: 'success',
      data: results,
      message: 'Vote results retrieved successfully',
    }
  }
}
