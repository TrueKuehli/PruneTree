import {assert} from 'chai';

import {PARTNER_TYPES, PartnerType} from '../../../src/common/scripts/partnerTypes';


describe('PARTNER_TYPES', () => {
  it('should have no duplicate values', () => {
    const findDuplicates = (arr: Readonly<PartnerType[]>) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    const duplicateElements = findDuplicates(PARTNER_TYPES);

    if (duplicateElements.length > 0) {
      console.log('Duplicate elements: ' + duplicateElements.join(', '));
    }
    assert.equal(duplicateElements.length, 0);
  });
});
