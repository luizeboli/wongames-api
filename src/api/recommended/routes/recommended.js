module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/recommended',
      handler: 'recommended.find',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/recommended',
      handler: 'recommended.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/recommended',
      handler: 'recommended.delete',
      config: { policies: [] },
    },
  ],
};
