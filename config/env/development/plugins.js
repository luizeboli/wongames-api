module.exports = () => ({
  email: {
    enabled: true,
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
      },
    },
  },
});
