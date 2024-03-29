module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/platforms',
      handler: 'platform.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/platforms/:id',
      handler: 'platform.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/platforms',
      handler: 'platform.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/platforms/:id',
      handler: 'platform.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/platforms/:id',
      handler: 'platform.delete',
      config: { policies: [] },
    },
  ],
};
