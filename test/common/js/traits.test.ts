import {assert} from 'chai';

import {Trait, TRAITS} from '../../../src/common/scripts/traits';


describe('TRAITS', () => {
  it('should have no duplicate values', () => {
    const findDuplicates = (arr: Readonly<Trait[]>) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(TRAITS);

    if (duplicateElements.length > 0) {
      console.log('Duplicate elements: ' + duplicateElements.join(', '));
    }
    assert.equal(duplicateElements.length, 0);
  });
});
