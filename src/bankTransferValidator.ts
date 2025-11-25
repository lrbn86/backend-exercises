import assert from 'node:assert/strict';
/*
 * Scenario: Simulate a bank transfer
 * Rules:
 * Cannot exceed daily limit
 * Cannot transfer more than balance
 */

interface Request {
  account_balance: number;
  daily_limit: number;
  transfer_amount: number;
  daily_transferred: number;
};

interface Response {
  success: boolean;
  new_balance: number;
  daily_transferred: number;
};

function transfer(req: Request): Response {
  const {
    account_balance,
    daily_limit,
    transfer_amount,
    daily_transferred,
  } = req;

  if (transfer_amount > daily_limit || transfer_amount > account_balance) {
    return {
      success: false,
      new_balance: account_balance,
      daily_transferred,
    };
  }

  return {
    success: true,
    new_balance: account_balance - transfer_amount,
    daily_transferred: daily_transferred + transfer_amount,
  };
}

assert.deepEqual(
  transfer({
    account_balance: 2000,
    daily_limit: 1500,
    transfer_amount: 1000,
    daily_transferred: 600,
  }),
  {
    success: true,
    new_balance: 1000,
    daily_transferred: 1600
  }
);

assert.deepEqual(
  transfer({
    account_balance: 2000,
    daily_limit: 1500,
    transfer_amount: 2000,
    daily_transferred: 600,
  }),
  {
    success: false,
    new_balance: 2000,
    daily_transferred: 600
  }
);

assert.deepEqual(
  transfer({
    account_balance: 2000,
    daily_limit: 1500,
    transfer_amount: 1600,
    daily_transferred: 600,
  }),
  {
    success: false,
    new_balance: 2000,
    daily_transferred: 600
  }
);
