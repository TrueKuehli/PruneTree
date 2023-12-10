const {assert} = require('chai');
const lifeStates = require('../../../src/common/scripts/lifeStates');

describe('lifeStates', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(lifeStates));
  });
  it('should have no duplicate values', () => {
    const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(lifeStates);
    console.log('Duplicate elements: ' + duplicateElements.join(', '));

    assert.equal((new Set(lifeStates)).size, lifeStates.length);
  });
  it('should only contain strings', () => {
    assert.isTrue(lifeStates.every((trait) => typeof trait === 'string'));
  });
  it('should have no empty strings', () => {
    assert.isFalse(lifeStates.some((trait) => trait === ''));
  });
});
