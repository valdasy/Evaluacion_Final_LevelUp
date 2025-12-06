module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: ["src/**/*.spec.js"],
    preprocessors: {
      "src/**/*.spec.js": ["webpack"],
    },
    webpack: {
      mode: "development",
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
              },
            },
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
      resolve: {
        extensions: [".js", ".jsx"],
      },
    },
    webpackMiddleware: {
      stats: "errors-only",
    },
    reporters: ["progress", "coverage"],
    coverageReporter: {
      dir: "coverage-karma/",
      reporters: [
        { type: "html", subdir: "html" }, 
        { type: "text-summary" }
      ],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ["Chrome"],
    singleRun: true,
    concurrency: Infinity,
  });
};
