const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::game.game', ({ strapi }) => ({
  async populate(ctx) {
    console.log('Starting data mining process...');

    const query = {
      page: 1,
      sort: 'popularity',
      ...ctx.query,
    };

    await strapi.services.game.populate(query);

    ctx.send('Finished data mining process...');
  },
}));
