import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
// components

import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayoutpatients() {
    const logo = <Box component="img" src="/static/logo.svg" sx={{ width: 200, height: 100}} />
  return (
    <>
      <HeaderStyle>
        {logo}
      </HeaderStyle>
      <Outlet />
    </>
  );
}
