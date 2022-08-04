const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::wishlist.wishlist', {
  async create(ctx) {
    const userToken = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);

    const body = {
      ...ctx.request.body,
      user: userToken.id,
    };

    const entity = await strapi.services.wishlist.create(body);
    return await this.sanitizeOutput(entity, ctx);
  },

  async update(ctx) {
    try {
      const entity = await strapi.services.wishlist.update({ id: ctx.params.id }, ctx.request.body);
      return await this.sanitizeOutput(entity, ctx);
    } catch (error) {
      throw strapi.errors.unauthorized(error);
    }
  },
});
