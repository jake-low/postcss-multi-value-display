// See CSS Display Module Level 3
// https://www.w3.org/TR/css-display-3 (retrieved 2020-03-25)

const lookup = new Map([
  ["block flow", "block"],
  ["block flow-root", "flow-root"],
  ["inline flow", "inline"],
  ["inline flow-root", "inline-block"],
  ["run-in flow", "run-in"],
  // multi-value "list-item" variants excluded for simplicity;
  // only "block flow list-item" has a legacy equivalent ("list-item")
  // and they aren't order-independent like the values included here are.
  ["block flex", "flex"],
  ["inline flex", "inline-flex"],
  ["block grid", "grid"],
  ["inline grid", "inline-grid"],
  ["inline ruby", "ruby"],
  // ["block ruby"] has no single-value equivalent
  ["block table", "table"],
  ["inline table", "inline-table"],
])

function * permutations(arr) {
  // Uses Heap's method; see:  Sedgewick, R. “Permutation Generation Methods,”
  // Computing Surveys 9, 2 (June 1977), 141.
  const length = arr.length
  let c = Array(length).fill(0)
  let i = 1

  yield arr.slice()

  while (i < length) {
    if (c[i] < i) {
      let k = i % 2 ? c[i] : 0
      let temp = arr[i]
      arr[i] = arr[k]
      arr[k] = temp
      c[i] += 1
      i = 1
      yield arr.slice()
    } else {
      c[i] = 0
      i += 1
    }
  }
}

for (const [key, value] of [...lookup.entries()]) {
  for (const permutation of permutations(key.split(" "))) {
    lookup.set(permutation.join(" "), value)
  }
}

const defaults = {
  preserve: false
}

module.exports = (options = {}) => {
  options = { ...defaults, ...options }

  return {
    postcssPlugin: "postcss-multi-value-display",
    Declaration: {
      display: (decl, { result }) => {
        if (!/ /.test(decl.value)) return

        const replacement = lookup.get(decl.value)
        if (replacement === undefined) {
          decl.warn(result, `Cannot transform 'display: ${decl.value}' (no legacy equivalent exists).`, { word: decl.value })
          return
        }

        if (options.preserve) {
          decl.cloneBefore({ value: replacement })
        } else {
          decl.value = replacement
        }
      }
    }
  }
}

module.exports.postcss = true
