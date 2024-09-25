import {
  BankAccountSubType,
  BankAccountType,
  TransactionStatus,
  TransactionType
} from './bank.enums';

export type Bank = {
  name: string;
  accounts: BankAccount[];
}

export type Transaction = {
  type: TransactionType;
  amount: number;
  date: Date;
  status: TransactionStatus;
}

export type Deposit = Transaction & {
  type: TransactionType.DEPOSIT;
}

export type Withdrawal = Transaction & {
  type: TransactionType.WITHDRAWAL;
}

export type Transfer = Transaction & {
  type: TransactionType.TRANSFER;
  to: BankAccount;
}

export type BankAccount = {
  owner: string;
  balance: number;
  type: BankAccountType;
  transactions: Transaction[],
  applyTransaction: (transaction: Transaction) => void;
}

export type AccountWithLimit = BankAccount & {
  withdrawalLimit: number;
}

export type CheckingAccount = BankAccount & {
  type: BankAccountType.CHECKING;
}

export type InvestmentAccount = BankAccount & {
  type: BankAccountType.INVESTMENT;
  subType: BankAccountSubType;
}

export type IndividualInvestmentAccount = InvestmentAccount & AccountWithLimit & {
  subType: BankAccountSubType.INDIVIDUAL;
  withdrawalLimit: 500;
}

export type CorporateInvestmentAccount = InvestmentAccount & {
  subType: BankAccountSubType.CORPORATE;
}

