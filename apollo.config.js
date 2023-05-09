module.exports = {
  client: {
    service: {
      name: 'library',
      url: 'http://localhost:3000/graphql',
    },
    includes: ['src/**/*.gql', 'src/**/*.graphql'],
  },
};
