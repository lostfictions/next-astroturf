# next-astroturf

Add [Astroturf](https://github.com/4Catalyzer/astroturf) support to [Next.js](https://nextjs.org/).

## Installation

```
npm install --save next-astroturf
```

or

```
yarn add next-astroturf
```

## Usage

Create a `next.config.js` in your project:

```js
// next.config.js
const withAstroturf = require("next-astroturf");
module.exports = withAstroturf();
```

### Custom Astroturf configuration

```js
// next.config.js
const withAstroturf = require("next-astroturf");
module.exports = withAstroturf({
  astroturf: {
    enableCssProp: false,
  },
});
```

### Usage with next-compose-plugins

For more complex configuration scenarios, [next-compose-plugins](https://github.com/cyrilwanner/next-compose-plugins) is recommended.

```js
const withPlugins = require("next-compose-plugins");
const optimizedImages = require("next-optimized-images");
const astroturf = require("next-astroturf");

module.exports = withPlugins(
  [optimizedImages, astroturf],
  // add other Next.js configuration options
  { reactStrictMode: true }
);
```

## Caveats

This plugin (inspired by the approach used by [next-linaria](https://github.com/Mistereo/next-linaria/)) patches Next's built-in CSS Modules support to correctly add the identifiers your Astroturf CSS tags are assigned to (eg. `noTouch` in `` const noTouch = css`touch-action: none`  ``) to the generated CSS classnames in the final output.

It _should_ be safe in most scenarios but has not been extensively tested. Please experiment to see if your use case is supported.

Next.js's existing restrictions about global CSS continue to apply; if you use global identifiers in your Astroturf CSS (with `:global()`), the selector must also include a _local_ classname. For fully global CSS, use a regular stylesheet and import it in your `_app.jsx` or `_app.tsx` file.

This module is only necessary if you're using Next.js with Webpack 5 support enabled (which is the default as of Next 11). If you're using Next on Webpack 4, just install Astroturf directly and add `astroturf/loader` to your Webpack config in `next.config.js` as described [here](https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config).
