# postcss-multi-value-display

[PostCSS] plugin to transform [CSS Display Module Level 3] multi-value syntax into legacy single-value equivalents (when available).

## Example

```js
const fs = require("fs")
const postcss = require("postcss")
const mvdisplay = require("postcss-multi-value-display")

let css = fs.readFileSync("input.css", "utf8")

let output = postcss()
  .use(mvdisplay)
  .process(css)
  .css
```

If `input.css` contains the following:

```css
.card-title {
  display: block flow;
}

.card-items {
  display: inline flex;
}
```

Then output will be:

```css
.card-title {
  display: block;
}

.card-items {
  display: inline-flex;
}
```

## Supported values

The following 'display' values have CSS level 2 single-value (legacy) equivalents and are supported by this plugin:

- `block flow` (equivalent to `block`)
- `block flow-root` (equivalent to `flow-root`)
- `inline flow` (equivalent to `inline`)
- `inline flow-root` (equivalent to `inline-block`)
- `run-in flow` (equivalent to `run-in`)
- `block flex` (equivalent to `flex`)
- `inline flex` (equivalent to `inline-flex`)
- `block grid` (equivalent to `grid`)
- `inline grid` (equivalent to `inline-grid`)
- `inline ruby` (equivalent to `ruby`)
- `block table` (equivalent to `table`)
- `inline table` (equivalent to `inline-table`)

Note that the two-value versions can be specified in either order (per the W3C spec), so e.g. both `inline flex` and `flex inline` will be transformed to `inline-flex`.

Other values from CSS Display Module Level 3 are **not supported**. This includes:

- `block ruby` as there is no single-value equivalent
- any of the multi-value `list-item` variants
- `contents` as this value introduces an entirely new semantic which cannot be emulated by transpiling

Also be aware that even among the single-value options which this plugin outputs, browser support is not universal. For example, `inline-block` is supported as far back as IE 8, but `flow-root` is unsupported in IE and in EdgeHTML-based (i.e. pre-Chromium) MS Edge versions.

## Options

This plugin can optionally be configured by passing in an options object, like this:

```js
const postcss = require("postcss")
const mvdisplay = require("postcss-multi-value-display")

const options = { ... }

postcss.use(mvdisplay(options)).process(...)
```

Allowed options are:

### `preserve` (default: false)

Keep two-value 'display' declarations but emit the appropriate single-value legacy syntax as a separate declaration above each. Browsers skip over declarations whose values they don't understand, so new browsers will use the latter line (overriding the former) while older ones will use the former and skip the latter.

This should generally never be necessary as the old values are completely equivalent to the new ones. In theory this means adding `{ preserve: true }` will not change any browsers' behavior and will only serve to bloat your output CSS.

## Warnings

This plugin will issue a warning if it encounters a `display` declaration with a multi-token value that it doesn't recognize. For example, if your CSS includes `display: block ruby;` somewhere and you run PostCSS from the CLI, you'd see a message like this:

```
6:3	⚠  Cannot transform 'display: block ruby' (no legacy equivalent exists). [postcss-multi-value-display]
```

## License

This repository is made available under the MIT license; see the included LICENSE file for details.

[PostCSS]: https://github.com/postcss/postcss
[CSS Display Module Level 3]: https://www.w3.org/TR/css-display-3
