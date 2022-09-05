import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import navConfig from './NavConfig';
import navConfigw from './NavConfigW';
import useAuth from '../../hooks/useAuth';
import Iconify from '../../components/Iconify';

import { authenticationService } from '../../services/authservices';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const data = authenticationService.currentUserValue;
  const {t} = useTranslation();


  const handleLogout = (e) =>{
    e.preventDefault();
    localStorage.removeItem('data');
    localStorage.removeItem('token');
    navigate('/login')

  }

  // console.log(data);
  
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
       
          <AccountStyle>
            {
              data.role ==="worker" && <Avatar src={"/static/worker.png"} alt="photoURL" />
              || <Avatar src={"/static/doctor.jpg"} alt="photoURL" />
            }
            {/* <Avatar src={"/static/doctor.jpg"} alt="photoURL" /> */}
            
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {data.username}
              </Typography>
            </Box>
          </AccountStyle>
     
      </Box>
      {
         data.role ==="worker" &&  <NavSection navConfig={navConfigw} />
      }
      {
         data.role ==="doctor" &&  <NavSection navConfig={navConfig} />
      }
      {/* <NavSection navConfig={navConfig} /> */}

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 1, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3}  mb={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
         
          <Box sx={{ textAlign: 'center' }}>
                   <Button variant="contained"  onClick={handleLogout} endIcon={<Iconify icon="websymbol:logout" />}>
                       {t('Logout')}
                    </Button>
          </Box>
         </Stack>
       </Box> 
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
