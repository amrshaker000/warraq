import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import membersReducer from "./slices/membersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
