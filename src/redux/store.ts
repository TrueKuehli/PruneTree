import {configureStore} from '@reduxjs/toolkit';
import treesReducer from './treeReducer';

export const store = configureStore({
  reducer: {
    trees: treesReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
