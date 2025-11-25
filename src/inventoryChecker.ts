import assert from 'node:assert/strict';

/*
 * Scenario: Add items to cart while respecting stock limits
 * Rules:
 * Cannot add more than stock - reserved
 * Update reserved stock if added successfully
 */
interface Product {
  name: string;
  stock: number;
  reserved: number;
};

const addToCart = (product: Product, quantity: number) => {
  const result = {
    added: 0,
    new_reserved: product.reserved,
    success: false,
  };

  const available = product.stock - product.reserved;

  if (quantity <= 0 || quantity > available) {
    return result;
  }

  const new_reserved = product.reserved + quantity;

  result.added = quantity;
  result.new_reserved = new_reserved;
  result.success = true;

  return result;
};

assert.deepEqual(addToCart({ name: 'Laptop', stock: 5, reserved: 2 }, 3), { added: 3, new_reserved: 5, success: true });
