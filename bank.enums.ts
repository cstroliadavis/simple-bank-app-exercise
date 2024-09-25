export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

export enum BankAccountType {
  CHECKING = 'checking',
  INVESTMENT = 'investment',
}


export enum BankAccountSubType {
  INDIVIDUAL = 'individual',
  CORPORATE = 'corporate',
}
