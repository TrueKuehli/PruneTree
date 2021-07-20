const { assert } = require('chai')
const traits = require('../../../src/common/js/traits')

describe('traits', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(traits))
  })
  it('should have no duplicate values', () => {
    assert.equal((new Set(traits)).size, traits.length)
  })
})
