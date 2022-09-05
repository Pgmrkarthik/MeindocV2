// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

   const navConfig = [
       {
         title: 'View requests',
         path: '/NHS/requests',
         icon: getIcon('carbon:task-view'),
       }
     ];
 
    



export default navConfig;
