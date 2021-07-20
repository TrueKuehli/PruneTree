const { assert } = require('chai')
const aspirations = require('../../../src/common/js/aspirations')

describe('aspirations', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(aspirations))
  })
  it('should have no duplicate values', () => {
    assert.equal((new Set(aspirations)).size, aspirations.length)
  })
})
