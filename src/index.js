const {
  isContainAnd,
  replacedAnd,
  getClassNameAttr,
  getPrefixesClassName
} = require('./utils');

module.exports = () => {
  const name = 'babel-plugin-transform-classname-and';

  const visitor = {
    JSXElement: path => {
      const classNameAttr = getClassNameAttr(path);

      if (isContainAnd(classNameAttr)) {
        const prefixes = getPrefixesClassName(path);
        if (!prefixes) throw Error('prefix not found');

        replacedAnd(classNameAttr, prefixes);
      }
    }
  };

  return {
    name,
    visitor,
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push('jsx');
    }
  };
};
