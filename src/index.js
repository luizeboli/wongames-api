'use strict';

module.exports = {
  register({ strapi }) {
    const extensionService = strapi.service('plugin::graphql.extension');
    const { toEntityResponseCollection, toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;

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
      typeDefs: `
        input WishlistCreateInput {
          games: [ID]
        }

        type Mutation {
          createWishlist(data: WishlistCreateInput!): WishlistEntityResponse
        }
      `,
      resolvers: {
        Mutation: {
          createWishlist: {
            async resolve(parent, args, context) {
              const createdWishlist = await strapi.entityService.create('api::wishlist.wishlist', {
                data: {
                  user: context.state.user.id,
                  games: args.data.games,
                },
              });

              return toEntityResponse(createdWishlist, { args, resourceUID: 'api::wishlist.wishlist' });
            },
          },
        },
      },

      resolversConfig: {
        'Mutation.updateWishlist': { policies: ['global::is-same-user', 'global::is-owner'] },
        'Mutation.createWishlist': { policies: ['global::is-same-user', 'global::is-owner'] },
      },
    }));
  },
};
