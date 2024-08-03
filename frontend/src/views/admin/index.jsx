import React, { useState, useEffect } from 'react';
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
  Slide,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add, Refresh, Close, MoreVert, Edit, VpnKey, Delete, Visibility } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBranches } from '../../action/adminAction';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const AdminList = () => {
  const dispatch = useDispatch();
  const [admins, setAdmins] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState({ name: '', email: '', password: '', role: '', branch: '', enabled: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [shakeField, setShakeField] = useState('');
  const { branches, loading, error } = useSelector((state) => state.admin);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  useEffect(() => {
    fetchAdmins();
    dispatch(getAllBranches());
  }, [dispatch]);

  const fetchAdmins = () => {
    // Simulated API call
    const dummyAdmins = [
      { id: 1, name: 'Admin 1', email: 'admin1@example.com', role: 'Admin', branch: 'Branch A', enabled: true },
      { id: 2, name: 'Admin 2', email: 'admin2@example.com', role: 'Manager', branch: 'Branch B', enabled: false },
    ];
    setAdmins(dummyAdmins);
  };

  const handleDrawerOpen = () => {
    setCurrentAdmin({ name: '', email: '', password: '', role: '', branch: '', enabled: true });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDetailsDrawerOpen = (admin) => {
    setCurrentAdmin(admin);
    setDetailsDrawerOpen(true);
  };

  const handleDetailsDrawerClose = () => {
    setDetailsDrawerOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentAdmin((prev) => ({ ...prev, [name]: name === 'enabled' ? checked : value }));

    setShakeField(name);
    setTimeout(() => setShakeField(''), 500);
  };

  const handleSubmit = () => {
    if (!currentAdmin.name || !currentAdmin.email || !currentAdmin.password || !currentAdmin.role || !currentAdmin.branch) {
      return;
    }

    const newAdmin = { ...currentAdmin, id: admins.length + 1 };
    setAdmins([...admins, newAdmin]);
    handleDrawerClose();
  };

  const handleMenuOpen = (event, adminId) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdminId(adminId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdminId(null);
  };

  const handleEdit = () => {
    console.log('Edit admin', selectedAdminId);
    handleMenuClose();
  };

  const handleUpdatePassword = () => {
    console.log('Update password for admin', selectedAdminId);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log('Delete admin', selectedAdminId);
    handleMenuClose();
  };

  const handleShow = (admin) => {
    handleDetailsDrawerOpen(admin);
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin List
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
            onClick={fetchAdmins}
            sx={{ mr: 1, backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
            variant="contained"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleDrawerOpen}
            sx={{ backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
          >
            Add New Admin
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Role</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Branch</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Enabled</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>{admin.branch}</TableCell>
                <TableCell>
                  <Switch checked={admin.enabled} disabled />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, admin.id)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleShow(admins.find(a => a.id === selectedAdminId))}>
          <Visibility sx={{ mr: 1 }} /> Show
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleUpdatePassword}>
          <VpnKey sx={{ mr: 1 }} /> Update Password
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Slide direction="right" in={drawerOpen} mountOnEnter unmountOnExit>
          <Box sx={{ width: 400, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                {currentAdmin.id ? 'Edit Admin' : 'Add Admin'}
              </Typography>
              <IconButton onClick={handleDrawerClose}>
                <Close />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={currentAdmin.name}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                sx: { 
                  animation: shakeField === 'name' ? `${shakeAnimation} 0.5s` : 'none', 
                  fontWeight: 'bold' 
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={currentAdmin.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                sx: { 
                  animation: shakeField === 'email' ? `${shakeAnimation} 0.5s` : 'none', 
                  fontWeight: 'bold' 
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={currentAdmin.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                sx: { 
                  animation: shakeField === 'password' ? `${shakeAnimation} 0.5s` : 'none', 
                  fontWeight: 'bold' 
                },
              }}
            />
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={currentAdmin.role}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                sx: { 
                  animation: shakeField === 'role' ? `${shakeAnimation} 0.5s` : 'none', 
                  fontWeight: 'bold' 
                },
              }}
            />
            <TextField
              fullWidth
              label="Branch"
              name="branch"
              value={currentAdmin.branch}
              onChange={handleChange}
              margin="normal"
              required
              select
              InputProps={{
                sx: { 
                  animation: shakeField === 'branch' ? `${shakeAnimation} 0.5s` : 'none', 
                  fontWeight: 'bold' 
                },
              }}
            >
              {loading ? (
                <MenuItem value="" disabled>Loading...</MenuItem>
              ) : error ? (
                <MenuItem value="" disabled>Error loading branches</MenuItem>
              ) : (
                branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))
              )}
            </TextField>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography sx={{ mr: 1 }}>Enabled</Typography>
              <Switch
                name="enabled"
                checked={currentAdmin.enabled}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleDrawerClose}
                sx={{ mr: 1, backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{ backgroundColor: '#693bb8', color: '#fff', '&:hover': { backgroundColor: '#5a2a9b' }}}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Slide>
      </Drawer>
      <Drawer anchor="right" open={detailsDrawerOpen} onClose={handleDetailsDrawerClose}>
        <Slide direction="right" in={detailsDrawerOpen} mountOnEnter unmountOnExit>
          <Box sx={{ width: 400, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                Admin Details
              </Typography>
              <IconButton onClick={handleDetailsDrawerClose}>
                <Close />
              </IconButton>
            </Box>
            <Typography variant="body1" fontWeight="bold">Name:</Typography>
            <Typography variant="body2">{currentAdmin.name}</Typography>
            <Typography variant="body1" fontWeight="bold">Email:</Typography>
            <Typography variant="body2">{currentAdmin.email}</Typography>
            <Typography variant="body1" fontWeight="bold">Role:</Typography>
            <Typography variant="body2">{currentAdmin.role}</Typography>
            <Typography variant="body1" fontWeight="bold">Branch:</Typography>
            <Typography variant="body2">{currentAdmin.branch}</Typography>
            <Typography variant="body1" fontWeight="bold">Enabled:</Typography>
            <Typography variant="body2">{currentAdmin.enabled ? 'Yes' : 'No'}</Typography>
          </Box>
        </Slide>
      </Drawer>
    </Box>
  );
};

export default AdminList;
