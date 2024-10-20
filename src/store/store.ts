import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userAPI } from "../services/UserService";
import logger from "redux-logger";
import { documentAPI } from "../services/DocumentService";

const rootReducer = combineReducers({
  [userAPI.reducerPath]: userAPI.reducer,
  [documentAPI.reducerPath]: documentAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })
        .concat(userAPI.middleware)
        .concat(documentAPI.middleware)
        .concat(logger),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
