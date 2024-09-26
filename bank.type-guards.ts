import type {
  AccountWithLimit,
  BankAccount,
  CheckingAccount,
  CorporateInvestmentAccount,
  IndividualInvestmentAccount,
  InvestmentAccount, TransactionRequest, Transfer
} from './bank.types.ts';
import {BankAccountSubType, BankAccountType, TransactionType} from './bank.enums.ts';

export const hasWithdrawalLimit = (account: BankAccount): account is AccountWithLimit => {
  return 'withdrawalLimit' in account;
}

export const isCheckingAccount = (account: BankAccount): account is CheckingAccount =>
  account.type === BankAccountType.CHECKING;

export const isInvestmentAccount = (account: BankAccount): account is InvestmentAccount => {
  return account.type === BankAccountType.INVESTMENT;
}

export const isIndividualInvestmentAccount = (account: BankAccount): account is IndividualInvestmentAccount =>
  isInvestmentAccount(account) &&
  hasWithdrawalLimit(account) &&
  account.subType === BankAccountSubType.INDIVIDUAL;

export const isCorporateInvestmentAccount = (account: BankAccount): account is CorporateInvestmentAccount => {
  return isInvestmentAccount(account) && account.subType === BankAccountSubType.CORPORATE;
}

export const isTransfer = (request: TransactionRequest): request is Transfer => {
  return request.type === TransactionType.TRANSFER;
}
