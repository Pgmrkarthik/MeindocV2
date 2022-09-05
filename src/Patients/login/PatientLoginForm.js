import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik, Form, FormikProvider, ErrorMessage } from 'formik';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------



export default function PatientLoginForm(){

  const navigate = useNavigate();
  const {requestid} = useParams();

  const [patientid, setPatientId] = useState(requestid);

  const [token, setToken] = useState(null);
  const [errormsg, setErrorMessage] =useState(false);
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [ispatientId, setIspatientId] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const {t} = useTranslation();


  const CheckRequestidAvailability =(request)=>{
    const credentials ={
      appid:process.env.REACT_APP_ID,
      requestid:request
    };
   return fetch('https://meindoc.app/backend/patients/check_patients_id.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }).then(data =>data.json()).then(data=>{

        setIspatientId(data.result);
      })
      .catch(err => console.error(err));
      
  }

 useEffect(()=>{
   CheckRequestidAvailability(requestid);
 },[requestid]);

  const LoginSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      requestid:patientid,
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true)
      loginauthentication(values);
    },
  });

 const loginUser = (credentials)=> {
    return fetch('https://meindoc.app/backend/patients/login-api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
      .then(result =>{
        if(result.success && result.videoUrl !== null && result.videoUrl !== undefined){
            localStorage.setItem('patient', JSON.stringify(result));
            navigate(`/patients/${result.requestid}/view`,{state:result})
        }
        else{
            setErrorMessage(true);
            if(result.success && (result.videoUrl === null || result.videoUrl === undefined)){
              setResponse(`The request id don't have video`);
            }
            else{
              setResponse(`${result.message}`);
            }
            

            setTimeout(()=>{
              setErrorMessage(false)
            },3000);
        }
        setLoading(false)
      })
  }

  const loginauthentication =  (values)=>{
    const response =  loginUser({
      appid:process.env.REACT_APP_ID,
      requestid:values.requestid,
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
        <Stack spacing={3} mb={3}>
          {
            !ispatientId &&
            <TextField
            fullWidth
            autoComplete="username"
            type="requestid"
            label="Request ID"
            {...getFieldProps('requestid')}
            error={Boolean(touched.requestid && errors.requestid)}
            helperText={touched.requestid && errors.requestid}
          />
          }
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
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading} >
           {t('submit')}
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
