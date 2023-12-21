const {assert} = require('chai');
const {TRAITS} = require('../../../src/common/scripts/traits');

describe('traits', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(TRAITS));
  });
  it('should have no duplicate values', () => {
    const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(TRAITS);
    console.log('Duplicate elements: ' + duplicateElements.join(', '));

    assert.equal((new Set(TRAITS)).size, TRAITS.length);
  });
  it('should only contain strings', () => {
    assert.isTrue(TRAITS.every((trait) => typeof trait === 'string'));
  });
  it('should have no empty strings', () => {
    assert.isFalse(TRAITS.some((trait) => trait === ''));
  });
});
