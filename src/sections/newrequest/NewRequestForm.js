import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import i18n from 'i18next';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// material
import { Stack, TextField, Button, Grid,MenuItem, Container,  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import SaveIcon from "@material-ui/icons/Save";
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Endata, Dedata } from '../../surgeryList/surgery_data';


import { authenticationService } from "../../services/authservices";
import { userService } from "../../services/user.services";
import { Role } from "../../helpers/Role";
import { history } from "../../helpers/history";


// component

// ----------------------------------------------------------------------



const optionValue = [];

const laguages =[{
  value: 'EN',
  id:1},
  {
    value: 'DE',
    id:2
  }
]



const Conformation = (props)=>{

  const {onClose,open} = props;
  const [Rvalue, setRvalue] = useState();
  const {t} = useTranslation();
  

 const handleCancel = () => {
   onClose(false);
 };

 const handleOk = () => {
   onClose(true);
 };
 return (
    <Dialog open={open}>
       <DialogTitle>Are you sure to make new request?</DialogTitle>
      <DialogActions>
       <Button autoFocus onClick={handleCancel}>
         Cancel
       </Button>
       <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
 )

}

export default function NewRequesstForm() {

  const id = authenticationService.currentUser.id;
  const [open, setOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [requestData, setRequestData] = useState();
  const {t} = useTranslation();

  // const addnewRequest = (value)=>{
  //   axios({
  //     method: "POST",
  //     url: "https://meindoc.app/backend/api/new_request.php",
  //     data: value,
  //     headers: {
  //         "Content-Type": 'application/json'
  //     }
  // }).then((response)=>{
   
  //   setLoading(false);
   
  //    alert(response.data.message)
  //    setResponse(response.data.message)

  //     if(response.data.success === 1 && response.data.result){
  //       localStorage.setItem('surgery', value);
  //       const requestid = response.data.result;
  //       navigate(`/dashboard/${requestid}/newrequestfile`,requestid);
  //     }
  // }).catch(error => alert(error));
  // }

  const navigate = useNavigate();
  const [errormsg, setErrorMessage] = useState(false);
  const [response, setResponse] = useState();
  const [surgerylist, setSurgerylist] = useState();
  const [loading, setLoading] = useState(false)
 
  // new surgery list modification
  const [surgery, setSurgery] = useState('');
  const [option, setOption] = useState([]);
  const [options, setOptions] = useState(null);
  
 
  const StoreOptionValue = (data,index) => {
    optionValue[index] = data;
   
    setOptions(optionValue);
  }

const getallSurgery = () => {
  
    const language = window.localStorage.getItem('i18nextLng'); 
    if(language === 'de'){
      setSurgerylist(Dedata);
    }
    else if(language === 'en'){
      setSurgerylist(Endata);
    }
    else{
      setSurgerylist(Endata);
    }
}
  // sergery name with surgery type


  useEffect(()=>{
    getallSurgery();  
  },[i18n.language]);





  // Initialization of formik elements validations schema for request
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    patientID : Yup.string().required('patient id required for case reference').max(100,'Too Long!').min(2,'Too Short!'),
    surgeryDate: Yup.date().default(() => new Date()),
    surgery: Yup.string().required('Surgery required'),
    description : Yup.string().required('description required'),
    languages: Yup.string().required('languages required')
  });
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      patientID:'',
      surgery:'',
      description:'',
      languages:'',
      type :'Nerve',
      surgeryDate: new Date(),
      createdat: new Date(),
      surgery_id:'',
      surgery_type:'',
      video_url:'',
      option:[],
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {

      Object.values(surgerylist).forEach((value) => {
        if (value.surgeryName === values.surgery) {
          
            values.surgery_type  = value.surgerytype ;
            values.surgery_id = value.surgery_id;
            values.video_url = null;
            if(value.options.length > 0) {
              values.option = options
            }
            else{
              values.option = null;
            }
            
          
          //  values.video_url = value.video_url;
        }
      
      })
  
      setLoading(true)
      setRequestData(values);
      handleEditClick();      
    },
  });
 

  const handleEditClick = () =>{
    setOpen(true)
  }

  const handleClose = (value) =>{
   
    if(value){
       const response  =  makeNewRequest(requestData);
    }

    else{
      setLoading(false);
      setConfirmRemove(false);
    }
    setOpen(false);
  }
  

// Assigning values to make new request 
  const  makeNewRequest = (values) =>{
    const uname = values.firstName.concat(" ", values.lastName);
    const Name = uname.toUpperCase(); 
    const data = {
      appid: process.env.REACT_APP_ID,
      doctorid: id,
      patientname: Name,
      patientid:values.patientID,
      surgerydate:values.surgeryDate,
      language: values.languages,
      surgeryid: values.surgery_id,
      surgeryname: values.surgery,
      surgery_type: values.surgery_type,
      status: 1,
      description: values.description,
      createdat: values.createdat,
      VideoUrl: values.video_url,
      option:values.option
    }
    userService.addNewRequest(data).then(
      response => {
        alert(response.message);
        if(response.success){
          localStorage.setItem("surgery_type", data.surgery_type);
          const requestid = response.result.requestid
          navigate(`/${requestid}/UploadReports`,data);
        } 
        setLoading(false);
      },
      error =>{
        console.log(error);
        setLoading(false);
      }
    );
  }

  const { errors, touched, onSubmit, values, getFieldProps,handleChange,setFieldValue } = formik;

  return (
   <Container>
    <FormikProvider value={formik} onSubmit={onSubmit} >
      <Form autoComplete="off" noValidate >
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t("First name")}
              value={values.firstName}
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
            <TextField
              fullWidth
              label={t("Last name")}
              value={values.firstName}
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>
          <Grid item xs={12}>
             <TextField
           id="patientID"
           label={t("Patient ID")}
           value={values.patientID}
           {...getFieldProps('patientID')}
           helperText={touched.patientID ? errors.patientID : ""}
           error={touched.patientID && Boolean(errors.patientID)}
           margin="dense"
           variant="outlined"
           fullWidth
         />
          </Grid>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("Surgery date")}
                  value={values.surgeryDate}
                  onChange={(newValue) => {
                    setFieldValue('surgeryDate', newValue);
                  }}
                  error={Boolean(touched.surgeryDate && errors.surgeryDate)}
                  helperText={touched.surgeryDate && errors.surgeryDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Stack>
          {surgerylist &&
           <TextField
           select
           id="surgery"
           label={t("Surgery")}
           value={surgery}
           onChange={(e)=>{
           
            values.surgery = e.target.value.surgeryName;
            setSurgery(e.target.value);
            setOption(e.target.value.options)
           }}
           helperText={touched.surgery ? errors.surgery : ""}
           error={touched.surgery && Boolean(errors.surgery)}
           margin="dense"
           variant="outlined"
           fullWidth
         >
           {surgerylist.map((option,index) => (
             <MenuItem key={index} value={option} optn={option.options}>
               {option.surgeryName}
             </MenuItem>
           ))}
           </TextField>
          }

          {
            option.length > 0 && 
            option.map((opt,index) =>(
              <div key={index}>
              <p>{opt.title}</p>
              <RadioGroup
              row
              aria-labelledby="surgery_options"
              name="surgery_options"
              sx={{marginTop:'0 !important'}}
              // defaultValue={opt.values[0]}
              onChange={(e)=>{
               const data = {
                  title: opt.title,
                  value: e.target.value,
                }
                StoreOptionValue(data,index); 
              }}
             >
              <FormControlLabel value={opt.values[0]} control={<Radio />} label={opt.values[0]} />
              <FormControlLabel value={opt.values[1]} control={<Radio />} label={opt.values[1]} />
            </RadioGroup>
            </div>
            )) 
          }
          
          {laguages &&
          <Grid item xs={12}>
             <TextField
           select
           id="languages"
           label={t("Languages")}
           value={values.languages}
           onChange={handleChange("languages")}
           helperText={touched.languages ? errors.languages : ""}
           error={touched.languages && Boolean(errors.languages)}
           margin="dense"
           variant="outlined"
           fullWidth
         >
           {laguages.map(option => (
             <MenuItem key={option.id} value={option.value}>
               {option.value}
             </MenuItem>
           ))}
           </TextField>
          </Grid>
}
          <Grid item xs={12}>
            <TextField
              id="description"
              label={t('Description')}
              multiline
              rows={4}
              variant="filled"
              fullWidth
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
          </Grid>

          <LoadingButton endIcon={<SaveIcon />}  sx={{ justifyContent: "center",width: "150px",height: "50px",}} variant="contained" type="submit" loading={loading}>
            {t('Save')} 
          </LoadingButton>

          <br />
          <br />
          {errormsg &&
            <Alert variant="outlined" severity="error">{response}</Alert>
          }
        </Stack>
      </Form>
    </FormikProvider>
    <Conformation
    id="removeconformation"
    keepMounted
    open={open}
    onClose={handleClose}
     />

</Container>


  );
}

const style = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  justifyContent: "center",
  width: "150px",
  height: "50px",
}));
