const {assert} = require('chai');
const {ASPIRATIONS} = require('../../../src/common/scripts/aspirations');

describe('aspirations', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(ASPIRATIONS));
  });
  it('should have no duplicate values', () => {
    const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(ASPIRATIONS);
    console.log('Duplicate elements: ' + duplicateElements.join(', '));

    assert.equal((new Set(ASPIRATIONS)).size, ASPIRATIONS.length);
  });
  it('should only contain strings', () => {
    assert.isTrue(ASPIRATIONS.every((trait) => typeof trait === 'string'));
  });
  it('should have no empty strings', () => {
    assert.isFalse(ASPIRATIONS.some((trait) => trait === ''));
  });
});
