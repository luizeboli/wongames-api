module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/publishers',
      handler: 'publisher.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/publishers/:id',
      handler: 'publisher.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/publishers',
      handler: 'publisher.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/publishers/:id',
      handler: 'publisher.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/publishers/:id',
      handler: 'publisher.delete',
      config: { policies: [] },
    },
  ],
};
