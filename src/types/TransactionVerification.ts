export interface TransactionVerification {
  isValid: boolean
  transactionId: string
  vote?: VoteDetails
}

interface VoteDetails {
  voterId: string
  partyChoice: string
  location: string
  timestamp: Date
}
