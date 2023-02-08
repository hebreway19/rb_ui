const {i18n} = require("./next-i18next.config");
const withImages = require("next-images");
const withAntdLess = require("next-plugin-antd-less");

module.exports = withAntdLess(withImages({
  lessVarsFilePathAppendToEndOfContent: false,
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(jpg|gif|png|svg|ico)$/i,
      use: [
        {
          loader: "url-loader",
          options: {
            // sample options
            limit: 8192,
            outputPath: "...",
            context: "src",
            name: "[path][name].[hash:8].[ext]"
          },
        },
      ],
    });
    return config;
  },
  i18n,
  webpack5: true,
  swcMinify: true
}));