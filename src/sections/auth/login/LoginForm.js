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
import {authenticationService} from '../../../services/authservices';
import {Role} from '../../../helpers/Role';

// ----------------------------------------------------------------------

export default function LoginForm(props) {

  const navigate = useNavigate();
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
      console.log(values)
      setLoading(true);
      authenticationService.login(values).then(user =>{
        console.log(user)
        if(user.role === Role.DOCTOR || user.role === Role.WORKER){
          navigate('/home',{state: user});
        }
        setLoading(false);
      },
      error =>{
        setErrorMessage(true)
        setResponse(error);
        setTimeout(()=>{
         setErrorMessage(false);
        },3000);
        setLoading(false);
      }
      )
    },
  });

 
  const { errors, touched, values, handleSubmit, getFieldProps} = formik;

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

          <Link component={RouterLink} variant="subtitle2" to="/auth/reset-password/" underline="hover">
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
