import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import LogoOnlyLayoutpatients from './layouts/LogoOnlyLayoutpatients';

// pages and components
import NewRequest from './pages/NewRequest';
import ViewRequests from './pages/ViewRequests';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import RequestDetail from './pages/RequestDetail';
import Newrequestfile from './pages/Newrequestfile';
import Imagereference from './pages/Imagereference';
import Patients from './Patients/PatientLogin';
import PatientHome from './Patients/PatientHome';
import WorkerRequestDetail from './pages/WorkerRequestDetail'

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
      path: '/',
      element: <DashboardLayout />,
      children: [
        {path:'/home', element: <ViewRequests />},
        { path: '/home/list', element: <ViewRequests />},
        { path: 'createRequest', element: <NewRequest /> },
        { path: '/Detail/:requestid', element: <RequestDetail /> },
        { path: '/Worker/:requestid', element: <WorkerRequestDetail /> },
        { path: ':requestid/UploadReports', element: <Newrequestfile /> },
        { path: ':requestid/UploadReference', element: <Imagereference /> },
      ],
    },
    {
      path: '/NHS',
      element: <NHSDashboardLayout />,
      children: [
        { path: 'requests', element: <NHSViewRequest/>},
        { path: 'newrequest', element: <NHSNewrequest /> },
        { path: ':requestid', element: <RequestDetail /> },
        { path: ':requestid', element: <NHSDetails /> },
        { path: '*', element: <Navigate to="/404" /> }
      ],
    },
    {
      path: '/worker/',
      element: < ViewRequests/>,
      children: [
        { path: 'user', element: <ViewRequests />},
        { path: 'Detail/:requestid', element: <WorkerRequestDetail /> },
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
