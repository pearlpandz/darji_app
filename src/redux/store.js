import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import loaderSlice from "./slices/loader";
import orderSlice from "./slices/order";

const middlewares = getDefaultMiddleware({
    // https://github.com/reduxjs/redux-toolkit/issues/415
    immutableCheck: false,
    serializableCheck: false
  });

if (__DEV__) {
    const createDebugger = require("redux-flipper").default;
    middlewares.push(createDebugger());
  }

const store = configureStore({
    reducer: {
        orders: orderSlice,
        loader: loaderSlice
    },
    middleware: middlewares,
});

export default store;