import * as Yup from 'yup';
import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik, Form, FormikProvider} from 'formik';
import { styled } from '@mui/material/styles';
// material
import { Stack,  TextField, IconButton, InputAdornment} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
// component
import Iconify from '../../../components/Iconify';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minWidth: '100%',
  justifyContent: 'center',
  flexDirection: 'column',
}));

// ----------------------------------------------------------------------

export default function PasswordForm() {
  const navigate = useNavigate();
  const [errormsg, setErrorMessage] =useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const {t} = useTranslation();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password does not match')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true)
      changePassword(values);
    },
  });

  const changePassword = (values)=>{
    const _requestData = {
      appid:process.env.REACT_APP_ID,
      email:values.email,
      password:values.password
    }
    const _request = JSON.stringify(_requestData);
    fetch("https://meindoc.app/backend/api/Password_Update.php",{
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
      setLoading(false);
      if(data.success !== 1){
        setTimeout(()=>{
          setErrorMessage(data.message)
        },3000)   
      }
      else{
         alert('Password Updated');
         navigate('/login/');
      }
    }).catch((error)=> {
      setLoading(false);
      console.log(error)
    });
  };

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps,onSubmit } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <ContentStyle>
    <FormikProvider value={formik} fullWidth>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit} fullWidth sx={{Width:"100%"}}>
        <Stack spacing={2} fullWidth>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
           <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="confirm password"
            {...getFieldProps('passwordConfirmation')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(errors.passwordConfirmation)}
            helperText={ errors.passwordConfirmation}
          />
        </Stack>
        <br />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading} loadingPosition="end">
           {t('Change Password')}
        </LoadingButton>
        <br />
        <br />
        {errormsg && 
          <Alert variant="outlined" severity="error">{errormsg}</Alert>
        }
      </Form>
    </FormikProvider>
    </ContentStyle>
  );
}
