// import axios from "axios";
// import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

// // Add Admin
// export const createAdmin = createAsyncThunk(
//   'admin/createAdmin',
//   async (adminData, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post('/api/v1/admin', adminData);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to create admin');
//     }
//   }
// );


// export const loginAdmin = createAsyncThunk(
//   'loginAdmin',
//   async (credentials, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await axios.post('/api/v1/admin/login', credentials);
//       const { token, admin } = response.data;
//       // Store the token
//       localStorage.setItem('token', token);
//       // Set the token in axios defaults
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       // Fetch Admin details
//       dispatch(getAdminDetails());
//       return admin;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Admin Login Failed');
//     }
//   }
// );





// // Logout Admin



// export const logoutAdmin = createAsyncThunk(
//   'admin/logoutAdmin',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post('/api/v1/admin/logout');
//       localStorage.removeItem('token');
//       delete axios.defaults.headers.common['Authorization'];
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Admin logout failed');
//     }
//   }
// );
// export const checkAuth = createAsyncThunk(
//   'admin/checkAuth',
//   async (_, { dispatch }) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Set the token in axios defaults
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       // Fetch Admin details
//       await dispatch(getAdminDetails());
//       return true;
//     }
//     return false;
//   }
// );

// // Get Admin Details
// export const getAdminDetails = createAsyncThunk(
//   'admin/getAdminDetails',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get('/api/v1/admin/me', {
//         withCredentials: true
//       });
//       return data.admin;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin details');
//     }
//   }
// );
// // Update Profile
// export const updateProfile = createAsyncThunk(
//   'admin/updateProfile',
//   async (profileData, { rejectWithValue }) => {
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data'  // Assuming you're sending form data
//         }
//       };
//       const { data } = await axios.put('/api/v1/admin/me/update', profileData, config);
//       return data.admin;  // Assuming the API returns the updated Admin object
//     } catch (error) {
//       return rejectWithValue(
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message
//       );
//     }
//   }
// );

// // export const updateProfile = createAsyncThunk(
// //   'user/updateProfile',
// //   async (profileData, { rejectWithValue }) => {
// //     try {
// //       const config = {
// //         headers: {
// //           'Content-Type': 'multipart/form-data'  // Assuming you're sending form data
// //         }
// //       };
// //       const { data } = await axios.put('/api/v1/users/me/update', profileData, config);
// //       return data.user;  // Assuming the API returns the updated user object
// //     } catch (error) {
// //       return rejectWithValue(
// //         error.response && error.response.data.message
// //           ? error.response.data.message
// //           : error.message
// //       );
// //     }
// //   }
// // );

// // // Get All Users (Admin)
// // export const getAllUsers = createAsyncThunk(
// //   'user/getAllUsers',
// //   async (_, { rejectWithValue, getState }) => {
// //     try {
// //       const { token } = getState().auth;
// //       const { data } = await axios.get('/api/v1/users/admin/users', {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       return data;
// //     } catch (error) {
// //       return rejectWithValue(error.response.data.message);
// //     }
// //   }
// // );

// // // Get Single User (Admin)
// // export const getSingleUser = createAsyncThunk(
// //   'user/getSingleUser',
// //   async (id, { rejectWithValue, getState }) => {
// //     try {
// //       const { token } = getState().auth;
// //       const { data } = await axios.get(`/api/v1/users/admin/user/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       return data;
// //     } catch (error) {
// //       return rejectWithValue(error.response.data.message);
// //     }
// //   }
// // );

// // // Update User Role (Admin)
// // export const updateUserRole = createAsyncThunk(
// //   'user/updateUserRole',
// //   async ({ id, role }, { rejectWithValue, getState }) => {
// //     try {
// //       const { token } = getState().auth;
// //       const { data } = await axios.put(`/api/v1/users/admin/user/${id}`, { role }, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       return data;
// //     } catch (error) {
// //       return rejectWithValue(error.response.data.message);
// //     }
// //   }
// // );

// // // Delete User (Admin)
// // export const deleteUser = createAsyncThunk(
// //   'user/deleteUser',
// //   async (id, { rejectWithValue, getState }) => {
// //     try {
// //       const { token } = getState().auth;
// //       await axios.delete(`/api/v1/users/admin/user/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       return id;
// //     } catch (error) {
// //       return rejectWithValue(error.response.data.message);
// //     }
// //   }
// // );

// // Clear Errors
// export const clearErrors = createAction('admin/clearErrors');

// // Clear Messages
// export const clearMessages = createAction('admin/clearMessages');
import axios from "axios";
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

// Add Admin
export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/admin', adminData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create admin');
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'admin/loginAdmin',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/admin/login', credentials);
      const { token, admin } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Dispatch checkAuth to validate the token and fetch admin details
      dispatch(checkAuth());
      return admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Admin Login Failed');
    }
  }
);
export const logoutAdmin = createAsyncThunk(
  'admin/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/logout');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Admin logout failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'admin/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Set the token in the default headers for all subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await axios.get('/api/v1/admin/me');
        return data.admin;
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        return rejectWithValue(error.response?.data?.message || 'Authentication failed');
      }
    }
    return rejectWithValue('No token found');
  }
);

export const getAdminDetails = createAsyncThunk(
  'admin/getAdminDetails',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/me', {
        withCredentials: true
      });
      return data.admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin details');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'admin/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const { data } = await axios.put('/api/v1/admin/me/update', profileData, config);
      return data.admin;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Branch actions
export const createBranch = createAsyncThunk(
  'admin/createBranch',
  async (branchData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/branch', branchData);
      return data.branch;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create branch');
    }
  }
);

export const getAllBranches = createAsyncThunk(
  'admin/getAllBranches',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/branch');
      return data.branches;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branches');
    }
  }
);

export const getBranchById = createAsyncThunk(
  'admin/getBranchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/branch/${id}`);
      return data.branch;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch');
    }
  }
);

export const updateBranch = createAsyncThunk(
  'admin/updateBranch',
  async ({ id, branchData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/${id}`, branchData);
      return data.branch;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update branch');
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'admin/deleteBranch',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/branch/${id}`);
      return id; // Return the id of the deleted branch
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete branch');
    }
  }
);
// export const deleteBranch = createAsyncThunk(
//   'admin/deleteBranch',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.delete(`/api/v1/branch/${id}`);
      
//       if (response.data.success) {
//         return { id, message: response.data.message || 'Branch deleted successfully' };
//       } else {
//         return rejectWithValue(response.data.message || 'Failed to delete branch');
//       }
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 
//         error.message || 
//         'An error occurred while deleting the branch'
//       );
//     }
//   }
// );


export const clearErrors = createAction('admin/clearErrors');
export const clearMessages = createAction('admin/clearMessages');
