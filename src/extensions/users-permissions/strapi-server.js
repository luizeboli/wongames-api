module.exports = (plugin) => {
  plugin.controllers.user.find = (ctx) => ctx.methodNotAllowed();

  return plugin;
};
