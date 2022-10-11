const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    const cartGamesId = await strapi.service('api::order.order').getCartGamesId(cart);

    const games = await strapi.service('api::order.order').getCartItems(cartGamesId);

    if (!games.length) {
      ctx.response.status = 404;
      return {
        error: 'No valid games found',
      };
    }

    const total = await strapi.service('api::order.order').getTotalValue(games);

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

  async create(ctx) {
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;

    const token = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
    const user = await strapi.query('user', 'users-permissions').findOne({ id: token.id });

    const cartGamesId = await strapi.config.functions.cart.getCartGamesId(cart);
    const games = await strapi.config.functions.cart.getCartItems(cartGamesId);
    const total_in_cents = await strapi.config.functions.cart.getTotalValue(games);

    let paymentInfo;
    if (total_in_cents) {
      try {
        paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
      } catch (error) {
        ctx.response.status = 402;
        return { error: error.message };
      }
    }

    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      card_brand: paymentInfo?.card?.brand,
      card_last4: paymentInfo?.card?.last4,
      games,
      user,
    };

    const entity = await strapi.services.order.create(entry);

    await strapi.plugins['email-designer'].services.email.send({
      templateId: 1,
      to: user.email,
      from: 'noreply@wongames.com',
      replyTo: 'noreply@wongames.com',
      data: {
        user,
        games,
        payment: {
          total: `$ ${total_in_cents / 100}`,
          card_brand: entry.card_brand,
          card_last4: entry.card_last4,
        },
      },
    });

    return await this.sanitizeOutput(entity, ctx);
  },
});
