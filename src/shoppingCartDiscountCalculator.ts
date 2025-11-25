import assert from 'node:assert/strict';

/*
 * Scenario: Apply discounts to a shopping cart
 * Rules:
 * If total > $500 -> 10% discount
 * Electronics discount: 5% if quantity >= 3 (applies only to electronics)
 * Only the highest discount applies
 */

interface Item {
  name: string;
  category: string;
  price: number;
  quantity: number;
};

const applyDiscount = (cart: Item[]) => {
  const totalCost = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
  const totalDiscount = totalCost > 500 ? totalCost * 0.1 : 0;

  let electronicsDiscount = 0;
  cart.forEach(item => {
    if (item.category === 'electronics' && item.quantity >= 3) {
      electronicsDiscount += item.price * item.quantity * 0.05;
    }
  });

  const discount = Math.max(totalDiscount, electronicsDiscount);
  const newTotalCost = totalCost - discount;

  return {
    total_before_discount: totalCost,
    discount,
    total_after_discount: newTotalCost,
  };
};

const cart = [
  { name: 'Laptop', category: 'electronics', price: 500, quantity: 2 },
  { name: 'Mouse', category: 'electronics', price: 50, quantity: 3 },
];

assert.deepEqual(applyDiscount(cart), { total_before_discount: 1150, discount: 115, total_after_discount: 1033 });
