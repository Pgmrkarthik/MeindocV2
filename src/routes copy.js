import { Navigate, useRoutes } from 'react-router-dom';

import { PrivateRoute } from './services/ProtectedRoutes';
import { Role } from './helpers/Role';

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import LogoOnlyLayoutpatients from './layouts/LogoOnlyLayoutpatients';

// pages and components
import NewRequest from './pages/NewRequest';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Details from './pages/Details';
import Newrequestfile from './pages/Newrequestfile';
import Imagereference from './pages/Imagereference';
import Patients from './Patients/PatientLogin';
import PatientHome from './Patients/PatientHome';

// NHS
import NHSNewrequest from './NHS/NewRequest';
import NHSDetails from './pages/NHSDetails';
import NHSDashboardLayout from './NHS/dashboard';
import NHSViewRequest from './pages/NHSViewRequest';


import ForgotPassword from './sections/auth/reset-password/ForgotPassword';
import NewPassword from './sections/auth/reset-password/NewPassword';




export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <PrivateRoute Component={DashboardLayout} roles={Role.DOCTOR || Role.WORKER} />,
      children: [
        { path: 'users', element: <User />},
        { path: 'new_request', element: <NewRequest /> },
        { path: ':requestid', element: <Details /> },
        { path: ':requestid/newrequestfile', element: <Newrequestfile /> },
        { path: ':requestid/imagereference', element: <Imagereference /> },
      ],
    },
    {
      path: '/NHS',
      element: <NHSDashboardLayout />,
      children: [
        { path: 'requests', element: <NHSViewRequest/>},
        { path: 'newrequest', element: <NHSNewrequest /> },
        { path: ':requestid', element: <Details /> },
        { path: ':requestid', element: <NHSDetails /> },
        { path: '*', element: <Navigate to="/404" /> }
      ],
    },
    {
      path: '/worker/view',
      element: < User/>,
      children: [
        { path: 'user', element: <User />},
        { path: ':requestid', element: <Details /> },
        { path: '*', element: <Navigate to="/404" /> }
      ],
    },
    { 
      path:'/patients',
      element: <LogoOnlyLayoutpatients />,
      children: [
        {path:'', element: <Patients />},
        {path:':requestid', element: <Patients />},
        {path:':requestid/view', element: <PatientHome />},
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '', element: <Login /> },
        { path: 'login', element: <Login /> },
        { path: '/auth/reset-password/', element: <ForgotPassword /> },
        { path: '/auth/new-password/', element: <NewPassword /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
  ]);
}
