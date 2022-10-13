'use strict';

module.exports = {
  register({ strapi }) {
    const extensionService = strapi.service('plugin::graphql.extension');
    const { toEntityResponseCollection, toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;

    const middleware = (resourceUID) => async (next, parent, args) => {
      const entity = await strapi.entityService.create(resourceUID, args);
      return toEntityResponse(entity, { args, resourceUID });
    };

    extensionService.use(({ nexus }) => ({
      types: [
        nexus.extendType({
          type: 'UsersPermissionsMe',
          definition(t) {
            t.field('wishlists', {
              type: 'WishlistEntityResponseCollection',
              resolve: async (root, args) => {
                const userData = await strapi.entityService.findMany('api::wishlist.wishlist', {
                  filters: { user: root.id },
                });

                return toEntityResponseCollection(userData ?? [], {
                  args,
                  resourceUID: 'api::wishlist.wishlist',
                });
              },
            });

            t.field('orders', {
              type: 'OrderEntityResponseCollection',
              resolve: async (root, args) => {
                const userData = await strapi.entityService.findMany('api::order.order', {
                  filters: { user: root.id },
                });

                return toEntityResponseCollection(userData ?? [], {
                  args,
                  resourceUID: 'api::order.order',
                });
              },
            });
          },
        }),
      ],

      resolversConfig: {
        'Mutation.createWishlist': {
          policies: ['global::is-same-user'],
          middlewares: [middleware('api::wishlist.wishlist')],
        },
        'Mutation.updateWishlist': { policies: ['global::is-same-user', 'global::is-owner'] },
        'Mutation.createOrder': {
          policies: ['global::is-same-user'],
          middlewares: [middleware('api::order.order')],
        },
        'Mutation.updateOrder': { policies: ['global::is-same-user', 'global::is-owner'] },
      },
    }));
  },
};
