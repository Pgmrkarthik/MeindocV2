// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


//  const  navConfig = [
//        // {
//        //   title: 'dashboard',
//        //   path: '/dashboard/app',
//        //   icon: getIcon('eva:pie-chart-2-fill'),
//        // },
//        {
//          title: 'View requests',
//          path: '/dashboard/user',
//          icon: getIcon('carbon:task-view'),
//        },
//        // {
//        //   title: 'product',
//        //   path: '/dashboard/products',
//        //   icon: getIcon('eva:shopping-bag-fill'),
//        // },
//        {
//          title: 'New request',
//          path: '/dashboard/new_request',
//          icon: getIcon('eva:file-text-fill'),
//        },
//        // {
//        //   // title: 'login',
//        //   path: '/login',
//        //   icon: getIcon('eva:lock-fill'),
//        // },
//        // {
//        //   title: 'register',
//        //   path: '/register',
//        //   icon: getIcon('eva:person-add-fill'),
//        // },
//        // {
//        //   title: 'Not found',
//        //   path: '/404',
//        //   icon: getIcon('eva:alert-triangle-fill'),
//        // },
//      ];
  
   

 

   const navConfig = [
       {
         title: 'View requests',
         path: '/home/list',
         icon: getIcon('carbon:task-view'),
       }
     ];
 
    



export default navConfig;
