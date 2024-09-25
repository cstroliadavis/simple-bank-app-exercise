import {describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import {Bank} from './bank.types.ts';
import {BankAccountSubType, BankAccountType} from './bank.enums.ts';

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

const bank = describe({ name: 'bank' });

// Mostly putting these tests in because they were described in the requirements, however,
// I would rarely test types for compliance.
it(bank, 'has a name', () => {
  const testData = getTestData();

  expect(Object.values(testData).every((b) => 'name' in b && typeof b.name === 'string'))
    .toBe(true);
})
