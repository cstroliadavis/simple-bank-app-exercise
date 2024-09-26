import {TransactionStatus, TransactionType} from "./bank.enums.ts";
import {
  BankAccount,
  BankAccountWithMethods,
  Transaction,
  TransactionRequest
} from "./bank.types.ts";
import {isTransfer} from './bank.type-guards.ts';

/**
 *  Sets up the initial transaction for the account if one does not exist
 * @param account
 */
const setupInitialTransaction = (account: BankAccount) => {
  const hasTransactions = account
    .transactions
    .filter((transaction) => transaction.status !== TransactionStatus.PENDING).length;

  if(hasTransactions) return;

  account.transactions = [{
    date: new Date(),
    status: TransactionStatus.COMPLETE,
    type: TransactionType.OPENING_BALANCE,
    amount: account.balance
  }, ...account.transactions];
}

/**
 *  Returns true if the transaction has been completed and is not a transfer
 * @param transaction
 */
const completedTransaction = (transaction: Transaction) =>
  transaction.status === TransactionStatus.COMPLETE &&
  transaction.type !== TransactionType.TRANSFER;

/**
 * Reducer that aggregates the sum of all provided transactions
 * @param sum
 * @param transaction
 */
const addAmount = (sum: number, transaction: Transaction) => sum + transaction.amount;

/**
 * Updates the balance of the account if there were no issues updating the data.
 * @param account
 * @param request
 */
const updateBalance = async (account: BankAccount, request: TransactionRequest) => {
  setupInitialTransaction(account);

  const currentBalance = account.balance;
  const transactionSum = account.transactions
    .filter(completedTransaction)
    .reduce(addAmount, 0);

  // Verify no changes have occurred during transaction (would be better to use a lock)
  if(currentBalance === transactionSum) {
    account.transactions = [...account.transactions, {
      date: new Date(),
      status: TransactionStatus.COMPLETE,
      ...request,
    }]
    account.balance = account.balance + request.amount;
  } else {
    account.transactions = [...account.transactions, {
      date: new Date(),
      status: TransactionStatus.FAILED,
      ...request,
    }]
  }
}

/**
 *  Uses composition to add methods to a bank account object
 *
 * @param bankAccount
 */
export const addAccountMethods = (bankAccount: BankAccount): BankAccountWithMethods => {

  const account: BankAccountWithMethods = {
    ...bankAccount,
    async applyTransaction (request: TransactionRequest) {
      account.transactions = [...account.transactions, {
        date: new Date(),
        status: TransactionStatus.PENDING,
        ...request,
      }];

      if(isTransfer(request)) {
        const withdrawalRequest: TransactionRequest = { type: TransactionType.WITHDRAWAL, amount: -request.amount };
        const depositRequest: TransactionRequest = { type: TransactionType.DEPOSIT, amount: request.amount };

        // TODO: fix so that nothing will get updated until all transactions are posted (I knew there was something I was forgetting)
        await Promise.all([
          updateBalance(account, withdrawalRequest),
          updateBalance(request.to, depositRequest),
        ]);
      }
      else {
        await updateBalance(account, request);
      }
    }
  };

  return account;
}
