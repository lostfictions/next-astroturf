const astroturfAltLoaderMatcher = /astroturf\/inline-loader/;

function traverse(rules) {
  for (const rule of rules) {
    if (typeof rule.loader === "string" && rule.loader.includes("css-loader")) {
      if (
        rule.options &&
        rule.options.modules &&
        typeof rule.options.modules.getLocalIdent === "function"
      ) {
        const nextGetLocalIdent = rule.options.modules.getLocalIdent;
        rule.options.modules.getLocalIdent = (
          context,
          localIdentName,
          localName,
          options
        ) => {
          const nextLocalIdent = nextGetLocalIdent(
            context,
            localIdentName,
            localName,
            options
          );

          return astroturfAltLoaderMatcher.test(context.request)
            ? `${nextLocalIdent}_${context.resourceQuery.slice(1)}`
            : nextLocalIdent;
        };
      }
    }
    if (typeof rule.use === "object") {
      traverse(Array.isArray(rule.use) ? rule.use : [rule.use]);
    }
    if (Array.isArray(rule.oneOf)) {
      traverse(rule.oneOf);
    }
  }
}

module.exports = (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      traverse(config.module.rules);

      config.module.rules.push({
        test: /\.(jsx?|tsx?|mjs)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "astroturf/loader",
            options: {
              ...(nextConfig.astroturf || {}),
              useAltLoader: true,
            },
          },
        ],
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      return config;
    },
  };
};
