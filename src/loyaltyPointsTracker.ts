import assert from 'node:assert/strict';

/*
 * Scenario: User earns points for purchases
 * Rules:
 * Earn 1 point per $10 spent
 * Points expire after 30 days (ignore for first iteration)
 */

interface Request {
  purchaseAmount: number;
  currentPoints: number;
};

interface Response {
  pointsEarned: number;
  totalPoints: number;
}

const earn = (req: Request): Response => {
  let {
    purchaseAmount,
    currentPoints,
  } = req;

  let points = 0;

  while (purchaseAmount) {
    points++;
    purchaseAmount -= 10;
  }

  return {
    pointsEarned: points,
    totalPoints: points + currentPoints,
  };
};

assert.deepEqual(
  earn({
    purchaseAmount: 120,
    currentPoints: 10
  }),
  {
    pointsEarned: 12,
    totalPoints: 22
  }
);
