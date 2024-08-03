import React, { useEffect, useState } from 'react';
import Loading from "../../ui-component/Loadex";
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  IconButton,
  Switch,
  Snackbar,
  Alert,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Refresh, Close, Edit, MoreVert } from '@mui/icons-material';
import { fetchProducts, addProduct } from '../../action/productAction';
import { fetchProductCategories } from '../../action/productCategoryActions';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, status, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.productCategories);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', category: '', price: '', ratings: '', enabled: true, image: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
      dispatch(fetchProductCategories());
    }
  }, [dispatch, status]);

  // Debugging - log categories to ensure they are being fetched correctly
  useEffect(() => {
    console.log('Categories:', categories);
  }, [categories]);

  const handleDrawerOpen = () => {
    setCurrentProduct({ name: '', category: '', price: '', ratings: '', enabled: true, image: null });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setCurrentProduct((prev) => ({ ...prev, image: files[0] }));
    } else {
      setCurrentProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', currentProduct.name);
      formData.append('category', currentProduct.category);
      formData.append('price', currentProduct.price);
      formData.append('ratings', currentProduct.ratings);
      formData.append('enabled', currentProduct.enabled);
      if (currentProduct.image) {
        formData.append('image', currentProduct.image);
      }

      const resultAction = await dispatch(addProduct(formData));
      if (addProduct.fulfilled.match(resultAction)) {
        showSnackbar('Product added successfully', 'success');
        dispatch(fetchProducts()); // Refresh the list
        handleDrawerClose();
      } else if (addProduct.rejected.match(resultAction)) {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      showSnackbar(`Failed to save product: ${error.message}`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '40%' }}
        />
        <Box>
          <Button
            startIcon={<Refresh />}
            onClick={() => dispatch(fetchProducts())}
            sx={{ mr: 1, backgroundColor: '#693bb8', color: '#fff' }}
            variant="contained"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleDrawerOpen}
            sx={{ backgroundColor: '#693bb8', color: '#fff' }}
          >
            Add New Product
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Product Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Ratings</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Loading />
                </TableCell>
              </TableRow>
            ) : status === 'failed' ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="error">Error: {error}</Typography>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.ratings}</TableCell>
                  <TableCell>
                    <Switch checked={product.enabled} disabled />
                  </TableCell>
                  <TableCell>
                    <IconButton disabled>
                      <Edit />
                    </IconButton>
                    <IconButton disabled>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>No products found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose} transitionDuration={500}>
        <Box sx={{ width: 400, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Add New Product</Typography>
            <IconButton onClick={handleDrawerClose}>
              <Close />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={currentProduct.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Typography gutterBottom>Product Category</Typography>
          <Select
            name="category"
            value={currentProduct.category}
            onChange={handleChange}
            fullWidth
            displayEmpty
            required
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Price"
            name="price"
            value={currentProduct.price}
            onChange={handleChange}
            margin="normal"
            required
            type="number"
          />
          <TextField
            fullWidth
            label="Ratings"
            name="ratings"
            value={currentProduct.ratings}
            onChange={handleChange}
            margin="normal"
            required
            type="number"
          />
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography>Enabled</Typography>
            <Switch
              checked={currentProduct.enabled}
              onChange={(e) => setCurrentProduct((prev) => ({ ...prev, enabled: e.target.checked }))}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography>Product Image</Typography>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              style={{ marginTop: 8, width: '100%' }}
            />
          </Box>
          <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Drawer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
