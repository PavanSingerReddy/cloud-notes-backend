// it is used with pm2 as pm2 start ecosystem.config.js

module.exports = {
    apps: [
      {
        name: "server",
        script: "./index.js",
        env: {
          PORT: 8080,
          MONGO_URL: "mongodb+srv://hapov48806:cs7RVNfiuaU9ggVR@cluster0.olftzvy.mongodb.net/cloudnotes?retryWrites=true&w=majority",
        },
      },
    ],
  };