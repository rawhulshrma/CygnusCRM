// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import adminReducer from '../slices/adminSlice';
import productCategoryReducer from '../slices/productCategorySlice';
import productReducer from '../slices/productSlice';
import customizationReducer from './customizationReducer';

export default combineReducers({
  admin: adminReducer,
  user: userReducer,
  productCategories: productCategoryReducer,
  products: productReducer,
  customization: customizationReducer
});