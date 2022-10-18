module.exports = ({ env }) => ({
  upload: {
    enabled: true,
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        uploadStream: {
          folder: env('CLOUDINARY_FOLDER', ''),
        },
        delete: {},
      },
    },
  },
  graphql: {
    enabled: true,
    config: {
      amountLimit: 10000,
      apolloServer: {
        tracing: true,
        cache: 'bounded',
      },
    },
  },
  wysiwyg: {
    enabled: true,
    resolve: './src/plugins/wysiwyg',
  },
});
