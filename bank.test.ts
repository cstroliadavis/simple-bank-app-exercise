import {describe, it} from '@std/testing/bdd';
import {expect} from '@std/expect';
import {Bank, BankAccount, TransactionRequest} from './bank.types.ts';
import {BankAccountSubType, BankAccountType, TransactionType} from './bank.enums.ts';
import {addAccountMethods} from './bank.ts';

const getTestData = (): Record<string, Bank> => ({
  bankA: {
    name: 'Central Bank',
    accounts: [
      {
        owner: 'Alice',
        balance: 1000,
        type: BankAccountType.CHECKING,
        transactions: []
      },
      {
        owner: 'Bob',
        balance: 2000,
        type: BankAccountType.INVESTMENT,
        subType: BankAccountSubType.INDIVIDUAL,
        transactions: []
      },
      {
        owner: 'Corporation C',
        balance: 5000,
        type: BankAccountType.INVESTMENT,
        subType: BankAccountSubType.CORPORATE,
        transactions: []
      }
    ]
  },
  bankB: {
    name: 'Major Credit Union',
    accounts: [
      {
        owner: 'Charlie',
        balance: 1500,
        type: BankAccountType.CHECKING,
        transactions: []
      },
      {
        owner: 'Diana',
        balance: 2500,
        type: BankAccountType.INVESTMENT,
        subType: BankAccountSubType.INDIVIDUAL,
        transactions: []
      }
    ]
  }
});

const getAllTestDataAccounts = (): BankAccount[] =>
  Object.values(getTestData()).flatMap((b) => b.accounts);

const byAccountType = (type: BankAccountType) => (a: BankAccount) => a.type === type;
const byOwnerIfSpecified = (owner?: string) => (a: BankAccount) => !owner || a.owner === owner;


const getCheckingAccount = (owner?: string): BankAccount =>
  getAllTestDataAccounts()
    .filter(byAccountType(BankAccountType.CHECKING))
    .find(byOwnerIfSpecified(owner))!;

const getInvestmentAccount = (owner?: string): BankAccount =>
  getAllTestDataAccounts()
    .filter(byAccountType(BankAccountType.INVESTMENT))
    .find(byOwnerIfSpecified(owner))!;

const bank = describe({name: 'bank'});

// Mostly putting these tests in because they were described in the requirements, however,
// I would rarely test types for compliance.
it(bank, 'has a name', () => {
  const testData = getTestData();

  expect(Object.values(testData).every((b) => 'name' in b && typeof b.name === 'string' && b.name))
    .toBe(true);
});

it(bank, 'can have several accounts', () => {
  const testData = getTestData();

  expect(Object.values(testData).every((b) => 'accounts' in b && Array.isArray(b.accounts)))
    .toBe(true);
});

const bankAccount = describe({name: 'account', suite: bank});

it(bankAccount, 'has an owner', () => {
  const allAccounts = getAllTestDataAccounts();

  expect(allAccounts.every(
    (account) => 'owner' in account && typeof account.owner === 'string' && account.owner)
  ).toBe(true);
});

it(bankAccount, 'can be checking or investment', () => {
  const allAccounts= getAllTestDataAccounts();

  expect(allAccounts.every(
    (account) => account.type === BankAccountType.CHECKING || account.type === BankAccountType.INVESTMENT
  )).toBe(true);
});

it.skip(bankAccount, 'can only be checking or investment', () => {
  // Since we are not actually inputting data here, we can't test this, yet.
});

// going to skip the sort of grunt testing being done above for now and do some real TFD.

const transactions = describe({name: 'transactions', suite: bank});

const checkingAccount = describe({name: 'checking account', suite: transactions});

it(checkingAccount, 'has a deposit transaction that updates the balance', async () => {
  const account = addAccountMethods(getCheckingAccount('Alice'));
  const transaction: TransactionRequest = { type: TransactionType.DEPOSIT, amount: 200 };

  await account.applyTransaction(transaction);

  expect(account.balance).toBe(1200);
});

it(checkingAccount, 'has a withdrawal transaction that updates the balance', async () => {
  const account = addAccountMethods(getCheckingAccount('Charlie'));
  const transaction: TransactionRequest = { type: TransactionType.WITHDRAWAL, amount: -500 };

  await account.applyTransaction(transaction);

  expect(account.balance).toBe(1000);
})

const investmentAccount = describe({name: 'investment account', suite: transactions});

it(investmentAccount, 'has a deposit transaction that updates the balance', async () => {
  const account = addAccountMethods(getInvestmentAccount('Bob'));
  const transaction: TransactionRequest = { type: TransactionType.DEPOSIT, amount: 100 };

  await account.applyTransaction(transaction);

  expect(account.balance).toBe(2100);
});

it(investmentAccount, 'has a withdrawal transaction that updates the balance', async () => {
  const account = addAccountMethods(getInvestmentAccount('Diana'));
  const transaction: TransactionRequest = { type: TransactionType.WITHDRAWAL, amount: -200 };

  await account.applyTransaction(transaction);

  expect(account.balance).toBe(2300);
})

const tranfer = describe({name: 'transfer', suite: transactions});

it(tranfer, 'withdraws money from one account and deposits money into another', async () => {
  const fromAccount = addAccountMethods(getCheckingAccount('Alice'));
  const toAccount = getInvestmentAccount('Bob');
  const transaction: TransactionRequest = {
    type: TransactionType.TRANSFER,
    amount: 500,
    to: toAccount
  };

  await fromAccount.applyTransaction(transaction);

  expect(fromAccount.balance).toBe(500);
  expect(toAccount.balance).toBe(2500);
});
