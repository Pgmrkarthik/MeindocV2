import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography,Stack } from '@mui/material';
import  PatientLoginForm  from './login/PatientLoginForm';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));


export default function Patients(){
  return (
    <Container maxWidth="sm">
          {/* <AccountPopover /> */}
         
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
               Login
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your requestid and password</Typography>
            
            <PatientLoginForm />



            {/* {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )} */}
          </ContentStyle>
      </Container>
  )
}
