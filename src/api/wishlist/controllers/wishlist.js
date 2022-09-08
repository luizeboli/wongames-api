const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::wishlist.wishlist', {
  find(ctx) {
    return ctx.methodNotAllowed();
  },
  findOne(ctx) {
    return ctx.methodNotAllowed();
  },
  create(ctx) {
    return ctx.methodNotAllowed();
  },
  update(ctx) {
    return ctx.methodNotAllowed();
  },
  delete(ctx) {
    return ctx.methodNotAllowed();
  },
});
