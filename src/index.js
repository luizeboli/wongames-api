'use strict';

module.exports = {
  register({ strapi }) {
    const extensionService = strapi.service('plugin::graphql.extension');
    const { toEntityResponseCollection } = strapi.plugin('graphql').service('format').returnTypes;

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
          },
        }),
      ],

      resolversConfig: {
        'Mutation.updateWishlist': { policies: ['global::is-same-user', 'global::is-owner'] },
        'Mutation.createWishlist': { policies: ['global::is-same-user', 'global::is-owner'] },
      },
    }));
  },
};
