module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/games',
      handler: 'game.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/games/:id',
      handler: 'game.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/games',
      handler: 'game.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/games/:id',
      handler: 'game.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/games/:id',
      handler: 'game.delete',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/games/populate',
      handler: 'game.populate',
      config: { policies: [] },
    },
  ],
};
