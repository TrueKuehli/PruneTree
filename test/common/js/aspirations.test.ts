import {assert} from 'chai';

import {Aspiration, ASPIRATIONS} from '../../../src/common/scripts/aspirations';


describe('ASPIRATIONS', () => {
  it('should have no duplicate values', () => {
    const findDuplicates = (arr: Readonly<Aspiration[]>) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(ASPIRATIONS);

    if (duplicateElements.length > 0) {
      console.log('Duplicate elements: ' + duplicateElements.join(', '));
    }
    assert.equal(duplicateElements.length, 0);
  });
});
