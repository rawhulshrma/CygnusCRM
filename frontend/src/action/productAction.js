import axios from "axios";
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';


// Add Product
export const addProduct = createAsyncThunk(
    'addProduct',
    async (productData, { rejectWithValue }) => {
      try {
        const { data } = await axios.post('/api/v1/product/admin/addproduct', productData);
        return data;
      } catch (error) {
        return rejectWithValue(error.response.data.message || 'Add Products Sucessfully');
      }
    }
  );
  

  export const fetchProducts = createAsyncThunk(
    'fetchProducts',
    async (_, thunkAPI) => {
      try {
        const response = await axios.get('/api/v1/products');
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );
// export const checkAuth = createAsyncThunk(
//   'user/checkAuth',
//   async (_, { dispatch }) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Set the token in axios defaults
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       // Dispatch getUserDetails to fetch user info
//       dispatch(getUserDetails());
//       return true;
//     }
//     return false;
//   }
// );


// Clear Errors
export const clearErrors = createAction('product/clearErrors');

// Clear Messages
export const clearMessages = createAction('product/clearMessages');
