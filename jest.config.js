export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@hapi/hapi|nanoid)/', // Transform dependencies seperti Hapi.js
  ],
};
