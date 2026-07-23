import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cabinetReducer from './slices/cabinetSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cabinet: cabinetReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
