// src/features/productCategories/productCategoryActions.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all product categories
export const fetchProductCategories = createAsyncThunk(
  'fetchProductCategories',
  // async (params, { rejectWithValue }) => {
  //   try {
  //     const response = await axios.get('/api/v1/category/product', { params });
  //     return response.data;
  //   } catch (error) {
  //     return rejectWithValue(error.response.data.message);
  //   }
  // }
  async () => {
    const response = await axios.get('/api/v1/category/product');
    return response.data;
  }
);



// Add new product category
export const addProductCategory = createAsyncThunk(
  'addProductCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/category/product', categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update product category
export const updateProductCategory = createAsyncThunk(
  'updateProductCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/v1/category/product/${id}`, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
