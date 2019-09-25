const { join } = require('path');
const { readdirSync, readFileSync } = require('fs');
const plugin = require('../src/index');
const { transformFileSync } = require('babel-core');

describe('index', () => {
  const fixturesDir = join(__dirname, './fixtures');
  const fixtures = readdirSync(fixturesDir);
  const plugins = [plugin];

  fixtures.map(caseName => {
    test(caseName, () => {
      const fixtureDir = join(fixturesDir, caseName);
      const inputFile = join(fixtureDir, 'input.js');
      const outputFile = join(fixtureDir, 'output.js');

      const actual = transformFileSync(inputFile, { plugins }).code;
      const expected = readFileSync(outputFile, 'utf-8');

      expect(actual).toEqual(expected);
    });
  });
});