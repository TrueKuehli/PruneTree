import { ADD_TREE, LOAD_TREES, UPDATE_TREE } from './actions'

const initialState = {
  usersTrees: []
}

function plumTreeApp (state = initialState, action) {
  switch (action.type) {
    case ADD_TREE:
      return Object.assign({}, state, {
        usersTrees: [
          ...state.usersTrees,
          action.tree
        ]
      })
    case UPDATE_TREE:
      return Object.assign({}, state, {
        usersTrees: state.usersTrees.map((tree) => {
          if (tree._id !== action.tree._id) {
          // This isn't the item we care about - keep it as-is
            return tree
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            ...tree,
            ...action.tree
          }
        })
      })
    case LOAD_TREES:
      return Object.assign({}, state, {
        usersTrees: action.trees
      })
    default:
      return state
  }
}

export default plumTreeApp
