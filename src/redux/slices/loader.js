import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
    name: 'Loader Slice',
    initialState: false,  // entire order intial state object should be here
    reducers: {
        setLoader: (state, action) => {
            state = action.payload
            return state;
        }
    }
});

const { actions, reducer } = loaderSlice;
export const { setLoader } = actions;
export default reducer;