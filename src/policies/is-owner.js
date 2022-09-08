const { PolicyError, ApplicationError } = require('@strapi/utils').errors;

const resourcesMap = {
  createWishlist: 'api::wishlist.wishlist',
  updateWishlist: 'api::wishlist.wishlist',
};

module.exports = async (policyContext, config, { strapi }) => {
  const currentUser = policyContext.state.user;

  // If user is creating a new item it's already covered by 'is-same-user' policy
  const isCreating = policyContext.info.fieldName.startsWith('create');
  if (isCreating) return true;

  const contentTypeResource = resourcesMap[policyContext.info.fieldName];
  if (!contentTypeResource) {
    strapi.log.error(`Could not find content type for operation ${policyContext.info.fieldName}`);
    strapi.log.error(`GraphQL operation: ${policyContext.info.fieldName}`);
    throw new ApplicationError('Something wrong happened...');
  }

  const resourceItem = await strapi.entityService.findOne(contentTypeResource, policyContext.args.id, {
    populate: { user: true },
  });

  const resourceIsFromAnotherUser = resourceItem.user.id !== currentUser.id;
  if (resourceIsFromAnotherUser) {
    strapi.log.error('is-owner policy');
    strapi.log.error(`User ID ${currentUser.id} is trying to mutate items of user ID (${resourceItem.user.id})`);
    strapi.log.error(`GraphQL operation: ${policyContext.info.fieldName}`);
    throw new PolicyError('You are not allowed to do this');
  }

  return true;
};
