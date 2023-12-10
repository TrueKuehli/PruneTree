const {assert} = require('chai');
const traits = require('../../../src/common/scripts/traits');

describe('traits', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(traits));
  });
  it('should have no duplicate values', () => {
    const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(traits);
    console.log('Duplicate elements: ' + duplicateElements.join(', '));

    assert.equal((new Set(traits)).size, traits.length);
  });
  it('should only contain strings', () => {
    assert.isTrue(traits.every((trait) => typeof trait === 'string'));
  });
  it('should have no empty strings', () => {
    assert.isFalse(traits.some((trait) => trait === ''));
  });
});
