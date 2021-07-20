const { assert } = require('chai')
const lifeStates = require('../../../src/common/js/lifeStates')

describe('lifeStates', () => {
  it('should be an array', () => {
    assert.isTrue(Array.isArray(lifeStates))
  })
  it('should have no duplicate values', () => {
    assert.equal((new Set(lifeStates)).size, lifeStates.length)
  })
})
