'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    const cartGamesId = await strapi.config.functions.cart.getCartGamesId(cart);

    const games = await strapi.config.functions.cart.getCartItems(cartGamesId);

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: 'No valid games found',
      };
    }

    const total = await strapi.config.functions.cart.getTotalValue(games);

    if (!total) {
      return { freeGames: true };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        metadata: { cart: JSON.stringify(cartGamesId) },
      });

      return paymentIntent;
    } catch (error) {
      return {
        error: error.raw.message,
      };
    }
  },
};
