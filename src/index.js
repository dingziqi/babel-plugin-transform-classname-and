const babelTypes = require('babel-types');

const getClassName = (path) => {
  const attrs = path.node.openingElement.attributes;
  const className = attrs.find((attr) => attr.name.name === 'className');
  return className;
};

const containAnd = (className) => className.match(/&/);

const shouldReplace = (className) => {
  const emptyPath = !className;
  if (emptyPath) return false;

  const emptyClassName = !className.value.value;
  if (emptyClassName) return false;

  return containAnd(className.value.value);
};

const getPrefixClassName = (current) => {
  let prefix;
  const finder = (path) => {
    if (!babelTypes.isJSXElement(path)) return false;
    const className = getClassName(path);

    if (
      !className
      || !className.value.value
      || containAnd(className.value.value)
    ) {
      return finder(path.parentPath);
    }

    [prefix] = className.value.value.split(' ');
  };

  finder(current.parentPath);

  return prefix;
};

module.exports = () => {
  const visitor = {
    JSXElement: (path) => {
      const className = getClassName(path);
      if (shouldReplace(className)) {
        const prefix = getPrefixClassName(path);
        if (!prefix) throw Error('prefix not found');
        className.value.value = className.value.value.replace('&', prefix);
      }
    },
  };
  return {
    name: 'babel-plugin-transform-classname-bem',
    visitor,
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push('jsx');
    },
  };
};
