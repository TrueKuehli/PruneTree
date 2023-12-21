const {assert} = require('chai');
const {LIFE_STATES} = require('../../../src/common/scripts/lifeStates');

describe('lifeStates', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(LIFE_STATES));
  });
  it('should have no duplicate values', () => {
    const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(LIFE_STATES);
    console.log('Duplicate elements: ' + duplicateElements.join(', '));

    assert.equal((new Set(LIFE_STATES)).size, LIFE_STATES.length);
  });
  it('should only contain strings', () => {
    assert.isTrue(LIFE_STATES.every((trait) => typeof trait === 'string'));
  });
  it('should have no empty strings', () => {
    assert.isFalse(LIFE_STATES.some((trait) => trait === ''));
  });
});
