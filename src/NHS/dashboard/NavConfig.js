// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


 const  navConfig = [
       // {
       //   title: 'dashboard',
       //   path: '/dashboard/app',
       //   icon: getIcon('eva:pie-chart-2-fill'),
       // },
       {
        title: 'View Requests',
        path: '/NHS/requests',
        icon: getIcon('carbon:task-view'),
      },
       // {
       //   title: 'product',
       //   path: '/dashboard/products',
       //   icon: getIcon('eva:shopping-bag-fill'),
       // },
       {
        title: 'New Request',
        path: '/NHS/newrequest',
        icon: getIcon('eva:file-text-fill'),
      }
       // {
       //   // title: 'login',
       //   path: '/login',
       //   icon: getIcon('eva:lock-fill'),
       // },
       // {
       //   title: 'register',
       //   path: '/register',
       //   icon: getIcon('eva:person-add-fill'),
       // },
       // {
       //   title: 'Not found',
       //   path: '/404',
       //   icon: getIcon('eva:alert-triangle-fill'),
       // },
     ];
  
   

 

    // navConfig = [
    //    {
    //      title: 'View requests',
    //      path: '/dashboard/user',
    //      icon: getIcon('carbon:task-view'),
    //    }
    //  ];
 
    



export default navConfig;
