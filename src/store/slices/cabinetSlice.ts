import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCabinetDetails, fetchVisitorAssignedCabinet, fetchVisitorLocation } from '../../services/ApiUtility';

export const getCabinetDetails = createAsyncThunk(
    'cabinet/getCabinetDetails',
    async (cabinetId: string, { rejectWithValue }) => {
        try {
            const response = await fetchCabinetDetails(cabinetId);
            if (response && response.success) {
                return response.cabinet;
            }
            return rejectWithValue('Failed to fetch cabinet details');
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getVisitorAssignedCabinet = createAsyncThunk(
    'cabinet/getVisitorAssignedCabinet',
    async ({ visitorId, idNumber }: { visitorId: string, idNumber: string }, { rejectWithValue }) => {
        try {
            const response = await fetchVisitorAssignedCabinet(visitorId, idNumber ?? "Tag1");
            if (response && response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to fetch visitor cabinet');
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getVisitorLocation = createAsyncThunk(
    'cabinet/getVisitorLocation',
    async (visitorId: string, { rejectWithValue }) => {
        try {
            const response = await fetchVisitorLocation(visitorId);
            if (response && response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to fetch visitor location');
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


interface CabinetState {
    cabinetDetails: any | null;
    visitorAssignedCabinet: any | null;
    visitorLocation: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: CabinetState = {
    cabinetDetails: null,
    visitorAssignedCabinet: null,
    visitorLocation: null,
    loading: false,
    error: null,
};

const cabinetSlice = createSlice({
    name: 'cabinet',
    initialState,
    reducers: {
        clearCabinetData: (state) => {
            state.cabinetDetails = null;
            state.visitorAssignedCabinet = null;
            state.visitorLocation = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCabinetDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getCabinetDetails.fulfilled, (state, action) => { state.loading = false; state.cabinetDetails = action.payload; })
            .addCase(getCabinetDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            
            .addCase(getVisitorAssignedCabinet.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getVisitorAssignedCabinet.fulfilled, (state, action) => { state.loading = false; state.visitorAssignedCabinet = action.payload; })
            .addCase(getVisitorAssignedCabinet.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            
            .addCase(getVisitorLocation.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getVisitorLocation.fulfilled, (state, action) => { state.loading = false; state.visitorLocation = action.payload; })
            .addCase(getVisitorLocation.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    }
});

export const { clearCabinetData } = cabinetSlice.actions;
export default cabinetSlice.reducer;
