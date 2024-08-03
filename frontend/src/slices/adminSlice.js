import { createSlice } from '@reduxjs/toolkit';
import {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  checkAuth,
  getAdminDetails,
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  clearErrors,
  clearMessages
} from '../action/adminAction';

const initialState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
  branches: [],  // Initialize branches here
  currentBranch: null,  // Initialize currentBranch
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Admin
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
        state.message = 'Admin created successfully';
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login Admin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
        state.message = 'Logged in successfully';
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout Admin
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.message = 'Logged out successfully';
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = action.payload;
      })

      // Get Admin Details
      .addCase(getAdminDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getAdminDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Create Branch
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.push(action.payload);
        state.message = 'Branch created successfully';
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Branches
      .addCase(getAllBranches.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(getAllBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Branch By Id
      .addCase(getBranchById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
      })
      .addCase(getBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Branch
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.branches.findIndex(branch => branch.id === action.payload.id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
        state.message = 'Branch updated successfully';
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Branch
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = state.branches.filter(branch => branch.id !== action.payload);
        state.message = 'Branch deleted successfully';
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Errors
      .addCase(clearErrors, (state) => {
        state.error = null;
      })

      // Clear Messages
      .addCase(clearMessages, (state) => {
        state.message = null;
      });
  }
});

export default adminSlice.reducer;
