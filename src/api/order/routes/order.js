module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/orders',
      handler: 'order.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/orders/:id',
      handler: 'order.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/orders',
      handler: 'order.create',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/orders/create-payment-intent',
      handler: 'order.createPaymentIntent',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/orders/:id',
      handler: 'order.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/orders/:id',
      handler: 'order.delete',
      config: { policies: [] },
    },
  ],
};
