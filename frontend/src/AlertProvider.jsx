// AlertProvider.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [alert.open]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={5000} 
        onClose={hideAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideAlert} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};