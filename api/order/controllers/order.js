'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    let games = [];

    for await (const game of cart) {
      const validatedGame = await strapi.services.game.findOne({
        id: game.id,
      });

      if (validatedGame) {
        games.push(validatedGame);
      }
    }

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: 'No valid games found',
      };
    }

    const total = games.reduce((acc, curr) => acc + curr.price, 0);

    if (!total) {
      return { freeGames: true };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' },
      });

      return paymentIntent;
    } catch (error) {
      return {
        error: error.raw.message,
      };
    }
  },
};
