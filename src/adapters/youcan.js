// Only demo behavior is implemented. Replace these boundaries with verified
// YouCan theme APIs; never insert private API credentials in browser code.
export const commerce = {
  async addItem(id, quantity, cart) {
    const next = cart.map(item => ({...item}));
    const existing = next.find(item => item.id === id);
    if (existing) existing.quantity = Math.min(20, existing.quantity + quantity);
    else next.push({id, quantity: Math.min(20, quantity)});
    return next;
  },
  async checkout() { throw new Error('الدفع غير متاح في النسخة التجريبية. سيتم ربطه بـ YouCan.'); },
};
