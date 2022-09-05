// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


 const  navConfig = [
       {
         title: 'View requests',
         path: '/home/list',
         icon: getIcon('carbon:task-view'),
       },

       {
         title: 'New request',
         path: '/createRequest',
         icon: getIcon('eva:file-text-fill'),
       },

     ];
export default navConfig;
