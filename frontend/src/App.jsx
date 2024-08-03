// import React, { useEffect, Suspense,useState  } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getUserDetails, checkAuth } from "./action/userAction";
// import { RouterProvider } from 'react-router-dom';
// import SmoothTransition from './SmoothTransition';
// import LazyLoadWrapper from './LazyLoadWrapper';
// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline, StyledEngineProvider } from '@mui/material';
// import Loadex from './ui-component/Loadex';
// import PerformanceOptimizer from './PerformanceOptimizer';
// import "./App.css"
// // routing
// import router from 'routes';

// // defaultTheme
// import themes from 'themes';

// // project imports
// import NavigationScroll from 'layout/NavigationScroll';
// import ErrorBoundary from './ErrorBoundary';

// // ==============================|| APP ||============================== //

// const App = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state) => state.user);
//   const customization = useSelector((state) => state.customization);

//   useEffect(() => {
//       dispatch(checkAuth());
//   }, [dispatch]);

//   useEffect(() => {
//       if (isAuthenticated) {
//           dispatch(getUserDetails());
//       }
//   }, [dispatch, isAuthenticated]);
  
//     return (
//       <ErrorBoundary>
//       <StyledEngineProvider injectFirst>
//         <ThemeProvider theme={themes(customization)}>
//           <CssBaseline />
//           <NavigationScroll>
//             <SmoothTransition>
//             <LazyLoadWrapper>
//             <PerformanceOptimizer>
//                 <Suspense fallback={<Loadex />}>
//                   <RouterProvider router={router} />
//                 </Suspense>
//                 </PerformanceOptimizer>
//             </LazyLoadWrapper>
//               </SmoothTransition>
//           </NavigationScroll>
//         </ThemeProvider>
//       </StyledEngineProvider>
//     </ErrorBoundary>
//     );
// };

// export default App;

import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDetails, checkAuth } from "./action/adminAction";
import { RouterProvider } from 'react-router-dom';
import SmoothTransition from './SmoothTransition';
import LazyLoadWrapper from './LazyLoadWrapper';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import Loadex from './ui-component/Loadex';
import PerformanceOptimizer from './PerformanceOptimizer';
import "./App.css";
// routing
import router from 'routes';
// defaultTheme
import themes from 'themes';
// project imports
import NavigationScroll from 'layout/NavigationScroll';
import ErrorBoundary from './ErrorBoundary';

// ==============================|| APP ||============================== //

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.admin);
  const customization = useSelector((state) => state.customization);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAdminDetails());
    }
  }, [isAuthenticated, dispatch]); // Ensure proper dependency

  return (
    <ErrorBoundary>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <SmoothTransition>
              <LazyLoadWrapper>
                <PerformanceOptimizer>
                  <Suspense fallback={<Loadex />}>
                    <RouterProvider router={router} />
                  </Suspense>
                </PerformanceOptimizer>
              </LazyLoadWrapper>
            </SmoothTransition>
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </ErrorBoundary>
  );
};

export default App;
