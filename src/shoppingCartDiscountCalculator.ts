/*
 * Shopping Cart Discount Calculator
 * Apply discounts to a shopping cart
 *
 * Rules:
 * If total > $500, apply 10% discount
 * Apply electronics discount 5% if item has category electronics and quantity >= 3
 *
 * Apply the highest of the two discounts
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

export default applyDiscount;
