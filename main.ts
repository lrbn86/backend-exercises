import assert from 'node:assert/strict';
import applyDiscount from './src/shoppingCartDiscountCalculator.js';

const cart = [
  { name: 'Laptop', category: 'electronics', price: 500, quantity: 2 },
  { name: 'Mouse', category: 'electronics', price: 50, quantity: 3 },
];

assert.deepEqual(applyDiscount(cart), { total_before_discount: 1150, discount: 115, total_after_discount: 1035 });
