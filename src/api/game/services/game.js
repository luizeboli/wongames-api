"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const axios = require("axios");
const chalk = require("chalk");
const slugify = require("slugify");
const qs = require("querystring");
const log = console.log;

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function Exception(e) {
  return { e, data: e.data && e.data.errors && e.data.errors };
}

async function getGameInfo(slug) {
  try {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;

    const body = await axios.get(`https://www.gog.com/game/${slug}`);
    const dom = new JSDOM(body.data);

    const ratingEl = dom.window.document.querySelector(
      ".age-restrictions__icon use"
    );
    const descriptionEl = dom.window.document.querySelector(".description");

    return {
      rating: ratingEl
        ? ratingEl.getAttribute("xlink:href").replace("#", "").replace("_", "")
        : "free",
      short_description: descriptionEl.textContent.trim().slice(0, 160),
      description: descriptionEl.innerHTML,
    };
  } catch (e) {
    console.log(chalk.red("getGameInfo:"), Exception(e));
  }
}

async function getEntityItemByName(entity, name) {
  try {
    const item = await strapi.services[entity].find({ name });
    return item.length ? item[0] : null;
  } catch (e) {
    console.log(chalk.red("getEntityItemByName:", Exception(e)));
  }
}

async function createEntityItem(entity, name) {
  try {
    const item = await getEntityItemByName(entity, name);

    if (!item) {
      log(chalk.cyan(`Creating '${entity}': '${name}'...`));
      return await strapi.services[entity].create({
        name,
        slug: slugify(name, { strict: true, lower: true }),
      });
    }
  } catch (e) {
    console.log(chalk.red("createEntityItem:"), Exception(e));
  }
}

async function createGameRelations(products) {
  try {
    const categories = {};
    const platforms = {};
    const developers = {};
    const publishers = {};

    products.forEach((product) => {
      const { genres, supportedOperatingSystems, developer, publisher } =
        product;

      genres &&
        genres.forEach((item) => {
          categories[item] = true;
        });

      supportedOperatingSystems &&
        supportedOperatingSystems.forEach((item) => {
          platforms[item] = true;
        });

      developers[developer] = true;
      publishers[publisher] = true;
    });

    return Promise.all([
      ...Object.keys(categories).map((name) =>
        createEntityItem("category", name)
      ),
      ...Object.keys(platforms).map((name) =>
        createEntityItem("platform", name)
      ),
      ...Object.keys(developers).map((name) =>
        createEntityItem("developer", name)
      ),
      ...Object.keys(publishers).map((name) =>
        createEntityItem("publisher", name)
      ),
    ]);
  } catch (e) {
    console.log(chalk.red("createGameRelations:"), Exception(e));
  }
}

async function createGames(products) {
  try {
    await Promise.all(
      products.map(async (product) => {
        const item = await getEntityItemByName("game", product.title);

        if (!item) {
          log(chalk.cyan(`Creating game: ${product.title}...`));

          const game = await strapi.services.game.create({
            name: product.title,
            slug: product.slug.replace("_", "-"),
            price: product.price.amount,
            release_date: new Date(
              Number(product.globalReleaseDate) * 1000
            ).toISOString(),
            categories: await Promise.all(
              product.genres.map((item) =>
                getEntityItemByName("category", item)
              )
            ),
            platforms: await Promise.all(
              product.supportedOperatingSystems.map((item) =>
                getEntityItemByName("platform", item)
              )
            ),
            developers: [
              await getEntityItemByName("developer", product.developer),
            ],
            publisher: await getEntityItemByName(
              "publisher",
              product.publisher
            ),
            ...(await getGameInfo(product.slug)),
          });

          if (product.image) {
            await uploadImage({ image: product.image, game });
          }

          if (product.gallery && product.gallery.length > 0) {
            await Promise.all(
              product.gallery.slice(0, 5).map((item) => {
                uploadImage({ image: item, game, field: "gallery" });
              })
            );
          }

          await timeout(15000);

          return game;
        }
      })
    );
  } catch (e) {
    console.log(chalk.red("createGames:"), Exception(e));
  }
}

async function uploadImage({ image, game, field = "cover" }) {
  try {
    const url = `https:${image}_bg_crop_1680x655.jpg`;
    const { data } = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "base64");

    const FormData = require("form-data");
    const formData = new FormData();

    formData.append("refId", game.id);
    formData.append("ref", "game");
    formData.append("field", field);
    formData.append("files", buffer, { filename: `${game.slug}.jpg` });

    log(chalk.cyan(`Uploading ${field} image: ${game.slug}...`));

    await axios({
      method: "POST",
      url: `http://${strapi.config.host}:${strapi.config.port}/upload`,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
  } catch (e) {
    console.log(chalk.red("uploadImage:"), Exception(e));
  }
}

module.exports = {
  populate: async (params) => {
    try {
      const gogEndpoint = `https://www.gog.com/games/ajax/filtered?mediaType=game&${qs.stringify(
        params
      )}`;

      const {
        data: { products },
      } = await axios.get(gogEndpoint);

      await createGameRelations(products);
      await createGames(products);

      console.log(chalk.green("Finished data mining process..."));
    } catch (e) {
      console.log(chalk.red("game.populate:"), Exception(e));
    }
  },
};
