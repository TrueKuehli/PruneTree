import {assert} from 'chai';

import {CONCEPTION_TYPES, ConceptionType} from '../../../src/common/scripts/conceptionTypes';


describe('CONCEPTION_TYPES', () => {
  it('should have no duplicate values', () => {
    const findDuplicates = (arr: Readonly<ConceptionType[]>) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(CONCEPTION_TYPES);

    if (duplicateElements.length > 0) {
      console.log('Duplicate elements: ' + duplicateElements.join(', '));
    }
    assert.equal(duplicateElements.length, 0);
  });
});
