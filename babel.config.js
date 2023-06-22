module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./resources"],
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
          ],
          alias: {
            "@src": "./resources",
            "@components": "./resources/components",
            "@helpers": "./resources/helpers",
            "@modules": "./resources/modules",
            "@factories": "./resources/factories",
            "@styles": "./resources/styles",
            "@constants": "./resources/constants",
            "@contexts": "./resources/contexts",
            "@store": "./resources/store",
            "@img": "./resources/img",
            "@riderModules": "./resources/modules/Rider",
            "@config": "./resources/config",
          },
        },
      ],
    ],
  };
};
