import React, { useEffect, useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { Add, Refresh, Close, Edit, MoreVert } from '@mui/icons-material';
import { fetchProductCategories, addProductCategory } from '../../action/productCategoryActions';

// Assume we have a colors array imported from a separate file
const colors = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  // ... other colors
];

const ColorDisplay = ({ color }) => (
  <div
    style={{
      width: 16,
      height: 16,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'inline-block',
      marginRight: 8,
    }}
  />
);

const ProductsCategory = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.productCategories);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '', description: '', color: 'red', enabled: true });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setCurrentCategory({ name: '', description: '', color: 'red', enabled: true });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleChange = (e) => {
    setCurrentCategory({ ...currentCategory, [e.target.name]: e.target.value });
  };

  const handleColorChange = (event) => {
    setCurrentCategory({ ...currentCategory, color: event.target.value });
  };

  const handleSubmit = async () => {
    try {
      const resultAction = await dispatch(addProductCategory(currentCategory));
      if (addProductCategory.fulfilled.match(resultAction)) {
        showSnackbar('Category added successfully', 'success');
        handleDrawerClose();
      } else {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      showSnackbar(`Failed to save category: ${error.message}`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Category List
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
            onClick={() => dispatch(fetchProductCategories())}
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
            Add New Product Category
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="error">Error: {error}</Typography>
                </TableCell>
              </TableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <ColorDisplay color={category.color} />
                    {category.color}
                  </TableCell>
                  <TableCell>
                    <Switch checked={category.enabled} disabled />
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <Edit />
                    </IconButton>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography>No categories found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 400, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Add New Product Category</Typography>
            <IconButton onClick={handleDrawerClose}>
              <Close />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={currentCategory.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={currentCategory.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Typography gutterBottom>Color</Typography>
          <Select
            value={currentCategory.color}
            onChange={handleColorChange}
            fullWidth
            displayEmpty
          >
            {colors.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ColorDisplay color={option.value} />
                  {option.label}
                </div>
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography>Enabled</Typography>
            <Switch
              checked={currentCategory.enabled}
              onChange={(e) => setCurrentCategory({ ...currentCategory, enabled: e.target.checked })}
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
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsCategory;