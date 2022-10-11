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

    const cartGamesId = await await strapi.service('api::order.order').getCartGamesId(cart);
    const games = await await strapi.service('api::order.order').getCartItems(cartGamesId);
    const total_in_cents = await await strapi.service('api::order.order').getTotalValue(games);

    let paymentInfo;
    if (total_in_cents) {
      try {
        paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
      } catch (error) {
        return ctx.paymentRequired({ error: error.message });
      }
    }

    const user = ctx.state.user;
    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      card_brand: paymentInfo?.card?.brand,
      card_last4: paymentInfo?.card?.last4,
      games,
      user,
    };

    const entity = await strapi.entityService.create('api::order.order', {
      data: entry,
    });

    await strapi
      .plugin('email-designer')
      .service('email')
      .sendTemplatedEmail(
        {
          to: user.email,
          from: 'noreply@wongames.com',
          replyTo: 'noreply@wongames.com',
        },
        {
          templateReferenceId: 1,
        },
        {
          user,
          games,
          payment: {
            total: `$ ${total_in_cents / 100}`,
            card_brand: entry.card_brand,
            card_last4: entry.card_last4,
          },
        },
      );

    return await this.sanitizeOutput(entity, ctx);
  },
});
