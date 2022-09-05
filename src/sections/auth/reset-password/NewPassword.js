import {useEffect, useState} from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider} from 'formik';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, TextField, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Page from '../../../components/Page';
// sections
import LanguagePopover from '../../../layouts/dashboard/LanguagePopover';
import PasswordForm from './PasswordForm';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

const _requestData = {
  appid:process.env.REACT_APP_ID,
  email :''
}

const OTPVerification = (otp)=>{

}

// ----------------------------------------------------------------------

export default function NewPassword() {
   const navigate = useNavigate();

  const [loading, setLoading] = useState();
  const location = useLocation();
  const [otpVerified, setOtpVerified] = useState(false);
  const [showNewpassword, setShowNewpassword] = useState(false);
  const [errormsg, setErrorMessage] = useState();
  const Email = location.state;

  const OtpValidationSchema = Yup.object().shape({
    otp: Yup.number().required('otp is required')
  });

  useEffect(()=>{
    if(!location.state){
      navigate('/auth/reset-password/');
    }
  },[])


  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: OtpValidationSchema,
    onSubmit: (values) => {
    setLoading(true);
    otpVerification(values);
    },
  });


  const otpVerification = (values) =>{
    const _requestData = {
      appid:process.env.REACT_APP_ID,
      email:Email,
      otp:values.otp
    }
    const _request = JSON.stringify(_requestData);
   fetch("https://meindoc.app/backend/apiV/Otp_Verification_mail.php",{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:_request
    }
    ).then((response)=>{
      if(!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return response.json();
    }).then((data)=>{
      setOtpVerified(data.response);
      setShowNewpassword(data.response);
      setLoading(false);
      if(data.response === false){
        setErrorMessage(data.message)
        setTimeout(()=>{
          setErrorMessage(false);
        },3000) 
      }
    }).catch((error)=> console.log(error));
  }
  const { errors,values, handleSubmit, getFieldProps} = formik;
  
  return (
    <Page title="New password">
      <Container>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center'}}>
          <Typography variant="h3" paragraph>
          Request sent successfully!
          </Typography>
          <Typography sx={{ color: 'text.secondary' }} mb={2}>
          We've sent a 6-digit confirmation email to your email.
         Please enter the code in below box to verify your email.
          </Typography>
          {
            !otpVerified  && 
            <>
              <FormikProvider value={formik}>
                 <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <TextField
                  id="otp"
                  label="OTP"
                  type="number"
                  variant="outlined"
                  sx={{marginTop:2,marginBottom: 2}}
                  fullWidth
                  value={values.otp}
                  {...getFieldProps('otp')}
                  error={Boolean( errors.otp)}
                  helperText={errors.otp}
                  />
              
                <LoadingButton sx={{marginTop: 2}} type="submit" color="primary" size="large" variant="contained" fullWidth
                 loading={loading} loadingPosition="end"
                >
                 Validate Otp
                </LoadingButton>
                </Form>
                </FormikProvider>
              </>
          }
          
          {
                  showNewpassword && otpVerified && <PasswordForm data={Email} />
          }
           {errormsg && 
                  <Alert variant="outlined" severity="error" sx={{marginTop: 2, marginBottom: 2}}>{errormsg}</Alert>
            }
        </ContentStyle>
      </Container>
    </Page>
  );
}
