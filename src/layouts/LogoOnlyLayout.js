import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
// components
import Logo from '../components/Logo';
import LanguagePopover from './dashboard/LanguagePopover';

// ----------------------------------------------------------------------

// const HeaderStyle = styled('header')(({ theme }) => ({
//   top: 0,
//   left: 0,
//   lineHeight: 0,
//   width: '100%',
//   position: 'absolute',
//   display: 'flex',
//   padding: theme.spacing(3, 3, 0),
//   [theme.breakpoints.up('sm')]: {
//     padding: theme.spacing(5, 5, 0),
//   },
// }));
const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));
const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  return (
    <>
  <RootStyle>
      <HeaderStyle>
        <Logo />
        <LanguagePopover />
      
      </HeaderStyle>
  </RootStyle> 
      <Outlet />
    </>
  );
}
