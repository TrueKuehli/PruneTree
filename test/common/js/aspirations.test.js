const {assert} = require('chai');
const aspirations = require('../../../src/common/scripts/aspirations');

describe('aspirations', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(aspirations));
  });
  it('should have no duplicate values', () => {
    const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(aspirations);
    console.log('Duplicate elements: ' + duplicateElements.join(', '));

    assert.equal((new Set(aspirations)).size, aspirations.length);
  });
  it('should only contain strings', () => {
    assert.isTrue(aspirations.every((trait) => typeof trait === 'string'));
  });
  it('should have no empty strings', () => {
    assert.isFalse(aspirations.some((trait) => trait === ''));
  });
});
