import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Tree} from '../common/scripts/types';


const initialState: { usersTrees: Tree[] } = {
  usersTrees: [],
};

const treesState = createSlice({
  name: 'trees',
  initialState: initialState,
  reducers: {
    // @ts-expect-error TS2321 TS2589
    // TS2321: Excessive stack depth comparing types 'WritableDraft<TreeState>' and 'TreeState'.
    // TS2589: Type instantiation is excessively deep and possibly infinite.
    // These are due to the recursive implementation of trees, but shouldn't lead to any problems for us.
    addTree: (state, action: PayloadAction<Tree>) => {
      state.usersTrees.push(action.payload);
    },
    updateTree: (state, action: PayloadAction<Tree>) => {
      state.usersTrees = state.usersTrees.map((tree) => {
        if (tree._id !== action.payload._id) {
          // This isn't the item we care about - keep it as-is
          return tree;
        }

        // Otherwise, this is the one we want - return an updated value
        return {
          ...tree,
          ...action.payload,
        };
      });
    },
    loadUsersTree: (state, action) => {
      state.usersTrees = action.payload;
    },
  },
});


export const {
  addTree,
  updateTree,
  loadUsersTree,
} = treesState.actions;
export default treesState.reducer;
