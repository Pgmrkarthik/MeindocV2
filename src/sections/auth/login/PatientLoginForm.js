import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik, Form, FormikProvider, ErrorMessage } from 'formik';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function PatientLoginForm(){
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [errormsg, setErrorMessage] =useState(false);
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {t} = useTranslation();
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true)
      loginauthentication(values);
    },
  });

 const loginUser = (credentials)=> {
 
    return fetch('https://meindoc.app/backend/api/login-api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
      .then(result =>{
        // console.log(result)
        if(result.success){
          setToken(result.token);
          localStorage.setItem('token',JSON.stringify(result.token));
          localStorage.setItem('data', JSON.stringify(result)); 
          const data = JSON.parse(localStorage.getItem('data'));
          if(data.role ==="doctor"){
            navigate('/dashboard/user',{redirect:true})
          }
          else if(data.role ==="worker"){
            navigate('/dashboard/user',{redirect:true})
          } 
        }
        else{
          setErrorMessage(true);
          setResponse(result.message);
          // console.log(response); 
        }
        setLoading(false)
      })
  }
  
  const loginauthentication =  (values)=>{
    const response =  loginUser({
      appid:process.env.REACT_APP_ID,
      userid:values.email,
      password:values.password
    });
  }
 
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps,onSubmit } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading} loadingPosition="end">
           {t('Login')}
        </LoadingButton>
        <br />
        <br />
        {errormsg && 
          <Alert variant="outlined" severity="error">{response}</Alert>
        }
      </Form>
    </FormikProvider>
  );
}
