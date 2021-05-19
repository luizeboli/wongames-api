const getCartGamesId = async (cart) => {
  return await cart.map((game) => ({ id: game.id }));
};

const getCartItems = async (cart) => {
  let games = [];

  for await (const game of cart) {
    const validatedGame = await strapi.services.game.findOne({
      id: game.id,
    });

    if (validatedGame) {
      games.push(validatedGame);
    }
  }

  return games;
};

const getTotalValue = async (games) => {
  const amount = await games.reduce((acc, curr) => acc + curr.price, 0);
  return Number((amount * 100).toFixed(0));
};

module.exports = { getCartItems, getTotalValue, getCartGamesId };
