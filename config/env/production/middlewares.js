module.exports = () => [
  {
    name: 'strapi::cors',
    config: {
      origin: ['wongames.felicio.dev'],
      methods: ['GET', 'POST', 'PUT', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
];
