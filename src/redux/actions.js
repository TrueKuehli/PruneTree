export const ADD_TREE = 'ADD_TREE'
export const UPDATE_TREE = 'UPDATE_TREE'
export const LOAD_TREES = 'LOAD_TREES'

export function addTree (tree) {
  return {
    type: ADD_TREE,
    tree
  }
}

export function updateTree (tree) {
  return {
    type: UPDATE_TREE,
    tree
  }
}

export function loadUsersTree (trees) {
  return {
    type: LOAD_TREES,
    trees
  }
}
