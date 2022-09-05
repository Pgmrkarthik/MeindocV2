import {useState} from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider} from 'formik';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, TextField, Link } from '@mui/material';
import Alert from '@mui/material/Alert';
import { LoadingButton } from '@mui/lab';
// components
import Page from '../../../components/Page';

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





// ----------------------------------------------------------------------

export default function ForgotPassword() {

  const navigate =useNavigate();

  const [mailid, setMailid] = useState();
  const [loading, setLoading] = useState();
  const [errormsg, setErrorMessage] = useState();
  const [response, setResponse] = useState();

  const EmailValidationSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required').max(100)
  });



  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: EmailValidationSchema,
    onSubmit: (values) => {
      setLoading(true); 

    setResponse(OnConformationMailSend(values.email));

    },
  });


  const OnConformationMailSend = (Email) =>{


    const _requestData = {
      appid:process.env.REACT_APP_ID,
      email:Email
    }
   
    const _request = JSON.stringify(_requestData);
  
    fetch("https://meindoc.app/backend/mailservices/OtpMail.php",{
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
            if(data.Message ==='User_Not_Found'){
              setErrorMessage('User not found');
              setLoading(false);
            }
            else if(data.Message ==='Invalid_Request'){
              setErrorMessage('Invalid request');
              setLoading(false);
            }
            else if(data.Message ==='Email sent!'){
              navigate('/auth/new-password/',{state:_requestData.email});
            }
            else{
              setErrorMessage('Something went wrong. Please try again!');
              setLoading(false);
            }
            setTimeout(()=>{
              setErrorMessage(false);
            },3000)
        }).catch((error) => {
          console.log(error)
      });
  
     
     // axios.get('https://meindoc.app/backend/mail/mailConformation.php')
  
  }

  const { errors, touched, values, handleSubmit, getFieldProps} = formik;


  return (
    <Page title="Reset password">
      <Container>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center'}}>
          <Typography variant="h3" paragraph>
          Forgot your password?
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link to reset your password.
          </Typography>
          <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={values.email}
                  sx={{marginTop:2}}
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
              />
                <LoadingButton sx={{marginTop: 2}} type="submit" color="primary" size="large" variant="contained" fullWidth
                 loading={loading} loadingPosition="end"
                >
                  Send Request
                </LoadingButton>
                </Form>
                </FormikProvider>
                <Link component={RouterLink} sx={{marginTop: 2}} type="submit" color="primary" size="large" fullWidth to="/" >
                  Back
                </Link>
                <br />
                <br />
                {errormsg && 
                  <Alert variant="outlined" severity="error">{errormsg}</Alert>
                }
        </ContentStyle>
      </Container>
    </Page>
  );
}
