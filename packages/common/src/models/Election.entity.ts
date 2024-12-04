import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'
import { Vote } from './Vote.entity'

@Entity()
export class Election {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  topicId: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'jsonb', nullable: true })
  partyTopics: Record<string, string>

  @OneToMany(() => Vote, (vote) => vote.election)
  votes: Vote[]
}
