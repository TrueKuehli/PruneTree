import {assert} from 'chai';

import {LIFE_STATES, LifeState} from '../../../src/common/scripts/lifeStates';


describe('LIFE_STATES', () => {
  it('should have no duplicate values', () => {
    const findDuplicates = (arr: Readonly<LifeState[]>) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(LIFE_STATES);

    if (duplicateElements.length > 0) {
      console.log('Duplicate elements: ' + duplicateElements.join(', '));
    }
    assert.equal(duplicateElements.length, 0);
  });
});
