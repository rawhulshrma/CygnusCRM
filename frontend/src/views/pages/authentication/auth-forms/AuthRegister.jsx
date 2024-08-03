import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, clearMessage, register } from "../../../../action/subUserAction";
import { Link, useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Loader from '../../../../ui-component/Loadex'; // Replace with actual path
import { notification } from 'antd';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project imports
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthRegister = ({ location = {}, ...others }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const [profilePreview, setProfilePreview] = useState(null);
  const [profile, setProfile] = useState(null);

  const { error,message, loading, isAuthenticated } = useSelector((state) => state.login);

  const redirect = location.search ? location.search.split("=")[1] : "/pages/login/login3";

  useEffect(() => {
    if (error) {
      console.error(error);
      notification.error({
        message: 'Error',
        description: 'Failed to register. Please try again.',
      });
      dispatch(clearErrors());
    }
    if (message) {
      notification.success({
        message: 'Success',
        description: message,
      });
      dispatch(clearMessage());
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, isAuthenticated, message, navigate, redirect]);

  const handleProfileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
        setProfile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const myForm = new FormData();
    myForm.set("name", values.name);
    myForm.set("email", values.email);
    myForm.set("password", values.password);
    if (profile) {
      myForm.set("profile", profile);
    }

    try {
      await dispatch(register(myForm));
      setSubmitting(false);
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitting(false);
    }
  };
  const googleHandler = async () => {
    console.log('Google Sign-in clicked');
    // Implement Google sign-in functionality here
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader /> // Replace with actual Loader component
      ) : (
        <Fragment>
          <Grid container direction="column" justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={googleHandler}
                  size="large"
                  sx={{
                    color: 'grey.700',
                    backgroundColor: theme.palette.grey[50],
                    borderColor: theme.palette.grey[100]
                  }}
                >
                  <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                    <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                  </Box>
                  Sign up with Google
                </Button>
              </AnimateButton>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                <Button
                  variant="outlined"
                  sx={{
                    cursor: 'unset',
                    m: 2,
                    py: 0.5,
                    px: 7,
                    borderColor: `${theme.palette.grey[100]} !important`,
                    color: `${theme.palette.grey[900]}!important`,
                    fontWeight: 500,
                    borderRadius: `${customization.borderRadius}px`
                  }}
                  disableRipple
                  disabled
                >
                  OR
                </Button>
                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
              </Box>
            </Grid>
            <Grid item xs={12} container alignItems="center" justifyContent="center">
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Sign up with Email address</Typography>
              </Box>
            </Grid>
          </Grid>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().max(255).required('Name is required'),
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} {...others}>
                <Grid container spacing={matchDownSM ? 0 : 2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      margin="normal"
                      name="name"
                      type="text"
                      value={values.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                      sx={{ ...theme.typography.customInput }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Profile"
                      margin="normal"
                      name="profile"
                      type="file"
                      onChange={handleProfileChange}
                      inputProps={{
                        accept: 'image/*',
                      }}
                      sx={{ ...theme.typography.customInput }}
                    />
                    {profilePreview && (
                      <Box mt={2}>
                        <img src={profilePreview} alt="Profile Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      </Box>
                    )}
                  </Grid>
                </Grid>

                <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email-register"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.email}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password-register"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-register">
                      {errors.password}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Password strength indicator */}
                {strength !== 0 && (
                  <FormControl fullWidth>
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" fontSize="0.75rem">
                            {level?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </FormControl>
                )}
                {errors.submit && (
                  <Box sx={{ mt: 3 }}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                      Sign up
                    </Button>
                  </AnimateButton>
                </Box>
              </form>
            )}
          </Formik>
        </Fragment>
      )}
    </Fragment>
  );
};

export default AuthRegister;


// import React, { Fragment, useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { clearErrors,clearMessage, register } from "../../../../action/userAction";
// import { Link, useNavigate } from 'react-router-dom';
// // material-ui
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
// import Grid from '@mui/material/Grid';
// import IconButton from '@mui/material/IconButton';
// import InputAdornment from '@mui/material/InputAdornment';
// import InputLabel from '@mui/material/InputLabel';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import Loader from '../../../../ui-component/Loadex'; // Replace with actual path

// // third party
// import * as Yup from 'yup';
// import { Formik } from 'formik';
// // project imports
// import Google from 'assets/images/icons/social-google.svg';
// import AnimateButton from 'ui-component/extended/AnimateButton';
// import { strengthColor, strengthIndicator } from 'utils/password-strength';
// // assets
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// const AuthRegister = ({ history, location = {}, ...others }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
//   const customization = useSelector((state) => state.customization);
//   const [showPassword, setShowPassword] = useState(false);
//   const [strength, setStrength] = useState(0);
//   const [level, setLevel] = useState();
//   const [profilePreview, setProfilePreview] = useState(null);
//   const [profile, setProfile] = useState(null);

//   const { error, loading, isAuthenticated } = useSelector((state) => state.login);

//   const redirect = location.search ? location.search.split("=")[1] : "/pages/login/login3";

//   useEffect(() => {
//     if (error) {
//       console.error(error);
//       dispatch(clearErrors());
//     }

//     if (isAuthenticated) {
//       history.push(redirect);
//     }
//   }, [ dispatch,error, history, isAuthenticated, redirect]);

//   const handleProfileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setProfilePreview(reader.result);
//         setProfile(file);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (values, { setSubmitting }) => {
//     const myForm = new FormData();
//     myForm.set("name", values.name);
//     myForm.set("email", values.email);
//     myForm.set("password", values.password);
//     if (profile) {
//       myForm.set("profile", profile);
//     }

//     dispatch(register(myForm));
//     setSubmitting(false);
//   };

//   const googleHandler = async () => {
//     console.log('Google Sign-in clicked');
//     // Implement Google sign-in functionality here
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const changePassword = (value) => {
//     const temp = strengthIndicator(value);
//     setStrength(temp);
//     setLevel(strengthColor(temp));
//   };




//   return (
//     <Fragment>
//       {loading ? (
//         <Loader /> // Replace with actual Loader component
//       ) : (
//         <Fragment>
//           <Grid container direction="column" justifyContent="center" spacing={2}>
//             <Grid item xs={12}>
//               <AnimateButton>
//                 <Button
//                   variant="outlined"
//                   fullWidth
//                   onClick={googleHandler}
//                   size="large"
//                   sx={{
//                     color: 'grey.700',
//                     backgroundColor: theme.palette.grey[50],
//                     borderColor: theme.palette.grey[100]
//                   }}
//                 >
//                   <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
//                     <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
//                   </Box>
//                   Sign up with Google
//                 </Button>
//               </AnimateButton>
//             </Grid>
//             <Grid item xs={12}>
//               <Box sx={{ alignItems: 'center', display: 'flex' }}>
//                 <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
//                 <Button
//                   variant="outlined"
//                   sx={{
//                     cursor: 'unset',
//                     m: 2,
//                     py: 0.5,
//                     px: 7,
//                     borderColor: `${theme.palette.grey[100]} !important`,
//                     color: `${theme.palette.grey[900]}!important`,
//                     fontWeight: 500,
//                     borderRadius: `${customization.borderRadius}px`
//                   }}
//                   disableRipple
//                   disabled
//                 >
//                   OR
//                 </Button>
//                 <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
//               </Box>
//             </Grid>
//             <Grid item xs={12} container alignItems="center" justifyContent="center">
//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="subtitle1">Sign up with Email address</Typography>
//               </Box>
//             </Grid>
//           </Grid>

//           <Formik
//             initialValues={{
//               name: '',
//               email: '',
//               password: '',
//               submit: null
//             }}
//             validationSchema={Yup.object().shape({
//               name: Yup.string().max(255).required('Name is required'),
//               email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
//               password: Yup.string().max(255).required('Password is required')
//             })}
//             onSubmit={handleSubmit}
//           >
//             {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//               <form noValidate onSubmit={handleSubmit} {...others}>
//                 <Grid container spacing={matchDownSM ? 0 : 2}>
//                   <Grid item xs={12} sm={12}>
//                     <TextField
//                       fullWidth
//                       label="Full Name"
//                       margin="normal"
//                       name="name"
//                       type="text"
//                       value={values.name}
//                       onBlur={handleBlur}
//                       onChange={handleChange}
//                       error={Boolean(touched.name && errors.name)}
//                       helperText={touched.name && errors.name}
//                       sx={{ ...theme.typography.customInput }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={12}>
//                     <TextField
//                       fullWidth
//                       label="Profile"
//                       margin="normal"
//                       name="profile"
//                       type="file"
//                       onChange={handleProfileChange}
//                       inputProps={{
//                         accept: 'image/*',
//                       }}
//                       sx={{ ...theme.typography.customInput }}
//                     />
//                     {profilePreview && (
//                       <Box mt={2}>
//                         <img src={profilePreview} alt="Profile Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
//                       </Box>
//                     )}
//                   </Grid>
//                 </Grid>
        
//                 <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
//                   <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
//                   <OutlinedInput
//                     id="outlined-adornment-email-register"
//                     type="email"
//                     value={values.email}
//                     name="email"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     inputProps={{}}
//                   />
//                   {touched.email && errors.email && (
//                     <FormHelperText error id="standard-weight-helper-text--register">
//                       {errors.email}
//                     </FormHelperText>
//                   )}
//                 </FormControl>

//                 <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
//                   <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
//                   <OutlinedInput
//                     id="outlined-adornment-password-register"
//                     type={showPassword ? 'text' : 'password'}
//                     value={values.password}
//                     name="password"
//                     label="Password"
//                     onBlur={handleBlur}
//                     onChange={(e) => {
//                       handleChange(e);
//                       changePassword(e.target.value);
//                     }}
//                     endAdornment={
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                           size="large"
//                         >
//                           {showPassword ? <Visibility /> : <VisibilityOff />}
//                         </IconButton>
//                       </InputAdornment>
//                     }
//                   />
//                   {touched.password && errors.password && (
//                     <FormHelperText error id="standard-weight-helper-text-password-register">
//                       {errors.password}
//                     </FormHelperText>
//                   )}
//                 </FormControl>

//                 {/* Password strength indicator */}
//                 {strength !== 0 && (
//                   <FormControl fullWidth>
//                     <Box sx={{ mb: 2 }}>
//                       <Grid container spacing={2} alignItems="center">
//                         <Grid item>
//                           <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
//                         </Grid>
//                         <Grid item>
//                           <Typography variant="subtitle1" fontSize="0.75rem">
//                             {level?.label}
//                           </Typography>
//                         </Grid>
//                       </Grid>
//                     </Box>
//                   </FormControl>
//                 )}
//                 {errors.submit && (
//                   <Box sx={{ mt: 3 }}>
//                     <FormHelperText error>{errors.submit}</FormHelperText>
//                   </Box>
//                 )}

//                 <Box sx={{ mt: 2 }}>
//                   <AnimateButton>
//                     <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
//                       Sign up
//                     </Button>
//                   </AnimateButton>
//                 </Box>
//               </form>
//             )}
//           </Formik>
//         </Fragment>
//       )}
//     </Fragment>
//   );
// };

// export default AuthRegister;
