import React,{useState,useEffect} from 'react';
import { Link as RouterLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
    Card,
    Container,
    Stack,
    Button,
    Typography,
    Grid,
    CardMedia,
    Checkbox,
    TextField,
    IconButton
} from '@mui/material';
// import PDFViewer from 'pdf-viewer-reactjs';  // pdf viewer for form react npm support packages
import { useTranslation } from 'react-i18next';
import { red } from '@mui/material/colors';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import RequestComponent from './RequestComponent';
import Label from '../components/Label';
import Video from './Video';





function NHSDetails() {

    const navigate = useNavigate();
    const data = JSON.parse(localStorage.getItem('data'));
    const location = useLocation();
    const [patientData, setPatientData] = useState(location.state);
    const [videoUrl, setVideoUrl] = useState();
    const [Rejected,setRejected] = useState([]);
    const [isReviewed, setIsReviewed] = useState(false);
    // video description...
    const [descriptionOn, setDescriptionOn] = useState(false);
    const [newdescription, setDescription] = useState('');

    // document description...

    const {t} = useTranslation();

    const setvideourlfunc = ()=>{
   
        if(patientData.VideoUrl !== null ){
            const values =JSON.parse(patientData.VideoUrl)
            setVideoUrl(values[0].file)
        }
    }

    useEffect(()=>{
        setvideourlfunc();
        setRejected(JSON.parse(patientData.rejectreason));
    },[])
    // function properties for worker Video upload url generation
    const getData = (data) => {  
        setVideoUrl(data);
    }
//  send description and Update the status 
    const RejectVideoUpdateDescription =()=>{

        const rejectreason = {
            date: new Date(),
            reason: newdescription
        }
        const data = {
            appid:process.env.REACT_APP_ID,
            requestid:patientData.requestid,
            description:rejectreason,
            status:4
        }
        axios({
            method: "POST",
            url: "https://meindoc.app/backend/api/update_description.php",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": 'application/json'
            }
        }).then((response)=>{
           
            if(response.data.success === 1 && response.data.message ==="ok" && response.data.data){
                setVideoUrl(null)
                setPatientData(response.data.data);
                setRejected(JSON.parse(response.data.data.rejectreason)); 
        
            }
            else{
                 console.log(response)
            } 
        }).catch((error) => {
            console.log(error);
        }) 
    }    
    const  RejectHandler = () => {
        setIsReviewed(true);
        setDescriptionOn(true);

    }
    const  AproveHandler=()=>{
        setIsReviewed(true);
        const data ={
            appid:process.env.REACT_APP_ID,
            requestid:patientData.requestid,
            content:'Video'
        }
        axios({
            method: "POST",
            url: "https://meindoc.app/backend/api/update_approved.php",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": 'application/json'
            }
        }).then((response)=>{
            if(response.data.success === 1 && response.data.message ==="ok" && response.data.data){
                setPatientData(response.data.data);
            }
        }).catch((error) => {
            console.log(error);
        }) 
    }
const handleCopy = ()=>{
    navigator.clipboard.writeText(`https://meindoc.app/patients/`);
  }

    return (

            <Page title="Detailed View">
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            {t('Detail')}
                        </Typography>
                        <Button variant="contained" component={RouterLink} to="/dashboard/user" startIcon={<Iconify icon="bx:arrow-back" />}>
                            {t('Back')}
                        </Button>
                    </Stack>
{/* video section */}
                    <Card>  
                        <Stack direction="column" justifyContent="space-between" m={5} spacing={3}>
                            <RequestComponent name={patientData.patientname} requestid={patientData.requestid} data={patientData} buttonenable={"disabled"} />
                            <Card >
                                <Grid item xs={8} m={2}>
                                    <Typography variant="h5" gutterBottom mb={2}>
                                        Video
                                    </Typography>
                                    {
                                           data.role === 'doctor' && patientData.status === 'complete' &&
                                           <Stack direction="row"  mb={2}>
                                            <Label mt={3} 
                                            color={'success'}
                                            >
                                            {`https://meindoc.app/patients/${patientData.requestid}`} <IconButton aria-label="delete" color={'primary'} size="small" onClick={handleCopy}>
                                           <Iconify fontSize={16} icon="mdi:content-copy"/>  
                                           </IconButton>
                                            </Label>
                                                                
                                           </Stack>
                                    }
                                    
                                    <Grid item xs={6} mb={2}>
                                    {
                                        videoUrl && (videoUrl !== null) && (videoUrl !== undefined) && <div>
                                        <Grid item xs={12} p={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                            
                                            <CardMedia
                                                component='video'
                                                className={""}
                                                controls
                                                src={videoUrl}
                                                autoPlay
                                                sx={{
                                                    maxHeight:'900px',
                                                }}
                                            />
                                            <br />
                                            {/* <a href={videoUrl} rel="noreferrer" target={"_blank"}>{videoUrl.split('/').pop()}</a> */}
                                        </Grid>
                                        {
                                            patientData.status !== 'complete' &&  data.role === 'doctor' && !isReviewed && !patientData.videoVerified &&
                                            <Grid item xs={6}>
                                            <Stack direction="row" justifyContent="end" spacing={2}>
                                                <Button variant="outlined" startIcon={<Iconify icon="bx:dislike"/>} color="error" onClick={RejectHandler}>
                                                    {t('Reject')}
                                                </Button>
                                                <Button variant="contained" endIcon={<Iconify icon="bx:like" />} color="success" onClick={AproveHandler}>
                                                    {t('Approve')}
                                                </Button>
                                            </Stack>
                                            </Grid>

                                        }
                                        {
                                         descriptionOn && 
                                         <Grid container spacing={3}>
                                             <Grid item xs={8}>
                                                    <TextField
                                                    id="description"
                                                    label="Tell us why...?"
                                                    multiline
                                                    rows={4}
                                                    variant="filled"
                                                    fullWidth
                                                    onChange={(e)=>{
                                                        setDescription(e.target.value);
                                                    }}
                                                    />
                                             </Grid>
                                             <Grid item xs={4} alignSelf={"end"} pb={1}  textAlign={"center"}>
                                             <Button variant="outlined"  endIcon={<Iconify icon="mdi:send" />} onClick={RejectVideoUpdateDescription}>
                                                Send
                                            </Button>
                                             </Grid>
                                        </Grid>
                                        }     
                                        </div>
                                        ||
                                        <Grid item xs={6} >
                                            <Label color={'error'} fontSize="2rem">No video available</Label>
                                        </Grid>

                                    }
                                    {
                                        data.role === 'worker' && !videoUrl &&
                                        <Grid item xs={6} mt={3}>
                                        <Video func={getData} />
                                        </Grid>
                                    }
                                    </Grid>

                                </Grid>
                            </Card>

                                {
                                       Rejected && Rejected.length > 0 &&   <Card >
                                        <Grid item xs={8} m={2}>
                                            <Typography variant="h6" gutterBottom>
                                               Rejected History 
                                            </Typography>
                                         {Rejected.map((result, index)=>(
                                            <Grid item xs={6} mb={2} key={index}>
                                            <Typography fontWeight={400} fontSize={13}>Date : {result.date}</Typography>
                                            <Typography fontWeight={400} fontSize={13}>Reason : {result.reason}</Typography>
                                            </Grid>
                                        ))
                                         }
                                            </Grid>
                                        </Card> 
                                    }
                            <Card >
                                <Grid item xs={8} m={2}>
                                    <Typography variant="h6" gutterBottom>
                                        Surgery
                                    </Typography>
                                    <Grid item xs={6} mb={2}>
                                    <Typography fontWeight={400} fontSize={13}>Name : {patientData.surgeryname}</Typography>
                                        { patientData.options !== null &&  JSON.parse(patientData.options).map((option,index)=>(<div key={index}>
                                            <Typography fontWeight={400} fontSize={13}>{option.title}</Typography>
                                            <Typography fontWeight={400} fontSize={13}>{option.value}</Typography>
                                        </div>
                                            
                                        ))
                                        }
                                        <Typography fontWeight={400} fontSize={13}>Type : {patientData.surgery_type}</Typography>
                                        <Typography fontWeight={400} fontSize={13}>Date : {patientData.surgerydate}</Typography>
                                        <Typography fontWeight={400} fontSize={13}>created AT : {patientData.createdat.slice(0, 10)}</Typography>
                                    </Grid>
                                    <Typography variant="h7" gutterBottom>
                                       <b>Description</b> 
                                    </Typography>
                                    <Grid item xs={6} mb={2}>
                                        <Typography>{patientData.description}</Typography>
                                    </Grid>
                                    <Grid item xs={6} mb={2}>
                                    <Typography><b>Doctor ID : {patientData.doctorid}</b></Typography>
                                    <Typography><b>Hospital : {patientData.hospital}</b></Typography>
                                    </Grid>                              
                                </Grid>
                            </Card>
                        </Stack>
                    </Card>
                </Container>
            </Page>
        )
}

export default NHSDetails