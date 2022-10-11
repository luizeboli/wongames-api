'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::order.order', ({ strapi }) => ({
  async getCartGamesId(cart) {
    return await cart.map((game) => ({ id: game.id }));
  },
  async getCartItems(cart) {
    let games = [];

    for await (const game of cart) {
      const validatedGame = await strapi.service('api::game.game').findOne(game.id);

      if (validatedGame) {
        games.push(validatedGame);
      }
    }

    return games;
  },
  async getTotalValue(games) {
    const amount = await games.reduce((acc, curr) => acc + curr.price, 0);
    return Number((amount * 100).toFixed(0));
  },
}));
