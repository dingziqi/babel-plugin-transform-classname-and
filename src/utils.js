const babelTypes = require('babel-types');

const PLACEHOLDER_REG = /&(\[(\d+)\])?/;

function isContainAnd(classNameAttr) {
  if (!classNameAttr || !classNameAttr.value.value) return;

  return PLACEHOLDER_REG.exec(classNameAttr.value.value);
}

function getClassNameAttr(path) {
  const attrs = path.node.openingElement.attributes;
  const className = attrs.find(attr => attr.name && attr.name.name === 'className');
  return className;
}

function getPrefixesClassName(currentPath) {
  let prefixes;
  const finder = path => {
    if (!babelTypes.isJSXElement(path)) return false;
    const classNameAttr = getClassNameAttr(path);

    if (isContainAnd(classNameAttr)) {
      return finder(path.parentPath);
    }

    prefixes = classNameAttr.value.value.split(' ');
  };

  finder(currentPath.parentPath);

  return prefixes;
}

function replacedAnd(classNameAttr, prefixes) {
  const replace = function() {
    let placeholder = isContainAnd(classNameAttr);
    if (!placeholder) return;

    const prefixIndex = placeholder[2] || 0;
    const prefix = prefixes[prefixIndex];
    if (!prefix) {
      throw Error('not fount prefix');
    }

    let classNameStr = classNameAttr.value.value;
    classNameAttr.value.value = classNameStr.replace(placeholder[0], prefix);

    replace();
  };

  replace();
}

module.exports = {
  replacedAnd,
  isContainAnd,
  PLACEHOLDER_REG,
  getClassNameAttr,
  getPrefixesClassName
};
