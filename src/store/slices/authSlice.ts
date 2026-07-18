import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VisitorData {
    id: string;
    visitorName: string;
    phoneNumber: string;
    email?: string;
    company?: string;
    idNumber?: string;
    purpose?: string;
    checkedIn?: boolean;
    checkedInAt?: string | null;
    qrExpiresAt?: string;
    createdAt?: string;
}

interface AuthState {
    token: string | null;
    visitor: VisitorData | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    visitor: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ token: string; visitor: VisitorData }>) {
            state.token = action.payload.token;
            state.visitor = action.payload.visitor;
            state.isAuthenticated = true;
        },
        clearCredentials(state) {
            state.token = null;
            state.visitor = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
