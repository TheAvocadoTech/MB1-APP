import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cabinetReducer from './slices/cabinetSlice';
import floorReducer from './slices/floorSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        cabinet: cabinetReducer,
        floor:floorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
