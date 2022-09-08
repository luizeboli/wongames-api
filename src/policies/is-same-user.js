const { PolicyError } = require('@strapi/utils').errors;

module.exports = async (policyContext, config, { strapi }) => {
  const currentUser = policyContext.state.user;
  const isOtherUser = policyContext.args?.data?.user && policyContext.args.data.user !== currentUser.id.toString();

  if (isOtherUser) {
    strapi.log.error('is-same-user policy');
    strapi.log.error(`User ID ${currentUser.id} is trying to do operations passing user ID ${policyContext.args?.data?.user}`);
    strapi.log.error(`GraphQL operation: ${policyContext.info.fieldName}`);
    throw new PolicyError('You are not allowed to do this');
  }

  return true;
};
