'use strict';

const { ForbiddenError } = require('@strapi/utils').errors;

const checkIfIsTryingToAccessOtherUser = (user, filterUser) => {
  if (!filterUser) return false;
  const errors = [];

  if (filterUser.id) {
    errors.push(Object.values(filterUser.id).some((id) => Number(id) !== user.id));
  }

  if (filterUser.username) {
    errors.push(Object.values(filterUser.username).some((username) => username !== user.username));
  }

  if (filterUser.email) {
    errors.push(Object.values(filterUser.email).some((email) => email !== user.email));
  }

  return !!errors.filter(Boolean).length;
};

module.exports = {
  register({ strapi }) {
    const extensionService = strapi.service('plugin::graphql.extension');

    extensionService.use(({ strapi }) => ({
      resolversConfig: {
        'Query.wishlists': {
          middlewares: [
            async (next, parent, args, context, info) => {
              // This condition will never be true because this route is only accessible to authenticated users,
              // through users-permissions plugin
              // It's just an example of how to use custom errors
              if (!context.state.isAuthenticated) {
                throw new ForbiddenError('You are not allowed to do this');
              }

              const isTryingToFetchOtherUserData = checkIfIsTryingToAccessOtherUser(context.state.user, args.filters?.user);

              if (isTryingToFetchOtherUserData) {
                return {
                  value: {
                    data: null,
                  },
                };
              }

              const res = await next(
                parent,
                { ...args, filters: { ...args.filters, user: { id: { eq: context.state.user.id } } } },
                context,
                info,
              );
              return res;
            },
          ],
        },
      },
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
              const { toEntityResponse } = strapi.service('plugin::graphql.format').returnTypes;
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
    }));
  },
};
