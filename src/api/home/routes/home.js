module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/home',
      handler: 'home.find',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/home',
      handler: 'home.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/home',
      handler: 'home.delete',
      config: { policies: [] },
    },
  ],
};
