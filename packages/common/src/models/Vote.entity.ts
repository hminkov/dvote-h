import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm'
import { Election } from './Election.entity'
import { User } from './User.entity'

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  transactionId: string

  @Column()
  partyChoice: string

  @Column()
  location: string

  @CreateDateColumn()
  timestamp: Date

  @ManyToOne(() => Election, (election) => election.votes)
  election: Election

  @ManyToOne(() => User, (user) => user.votes)
  user: User
}
