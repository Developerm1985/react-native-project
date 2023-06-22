const apiKeys = {
  development: {
    google: "",
  },
  production: {
    google: "",
  },
};

const apiKey = apiKeys[process.env.NODE_ENV];

export { apiKey };
