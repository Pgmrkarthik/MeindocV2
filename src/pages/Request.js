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
import Data from './RequestComponent';
import Label from '../components/Label';
import useAuth from '../hooks/useAuth';
import Video from './Video';
import Document from './Document';
import FileUpload from '../sections/newrequest/FileUpload';

import  authHeader  from '../helpers/authHeader';
import { authenticationService } from '../services/authservices';


function Request() {

    const data = authenticationService.currentUserValue;
    const location = useLocation();
    const [patientData, setPatientData] = useState(location.state);
    const [change, setChange] = useState(false);
    const [videoUrl, setVideoUrl] = useState();
    const [DocumentUrl, setDocumentUrl] = useState();
    const [Rejected,setRejected] = useState([]);
    const [documentRejected,setDocumentRejected] = useState([]);

    const [isReviewed, setIsReviewed] = useState(false);
    // video description...
    const [descriptionOn, setDescriptionOn] = useState(false);
    const [newdescription, setDescription] = useState('');

    // document description...
    const [DdescriptionOn, setDDescriptionOn] = useState(false);
    const [Dnewdescription, setDDescription] = useState('');
    const [isDocumentReviewed, setIsDocumentReviewed] = useState(false);

    const {t} = useTranslation();

    const setvideourlfunc = ()=>{
        if(patientData.VideoUrl !== null ){
            const values =JSON.parse(patientData.VideoUrl)
            setVideoUrl(values[0].file)
        }
    }


    const setdocumentUrlfunc = () => {
        if(patientData.documentUrl !== null){
            const values =JSON.parse(patientData.documentUrl)
            setDocumentUrl(values[0].file);
        }
    }

    useEffect(()=>{
        setvideourlfunc();
        setdocumentUrlfunc();
        setRejected(JSON.parse(patientData.rejectreason));
        setDocumentRejected(JSON.parse(patientData.Documentrejectreason));
    },[change])

    let reportshtml;
   
    if(patientData.reportimage){
         reportshtml = JSON.parse(patientData.reportimage).map((data,index)=> {  
            const filename = (data.file).split('/').pop()
            return(
               <Grid item xs={12} p={1} key={index} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
               <a href={data.file} key={index} rel="noreferrer" target={"_blank"}>{filename}</a>
               </Grid>
            )  
        });
    }

    // function properties for worker Video upload url generation
    const getData = (data) => {  
        setVideoUrl(data);
    }
    const getDocumentData = (data) => {  
        setDocumentUrl(data);
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


       // document related functions

       const RejectDocumnetUpdateDescription = () => {
        const rejectreason = {
            date: new Date(),
            reason: Dnewdescription
        }
        const data = {
            appid:process.env.REACT_APP_ID,
            requestid:patientData.requestid,
            description:rejectreason,
            status:4
        }
        axios({
            method: "POST",
            url: "https://meindoc.app/backend/api/Update_Document_Reject.php",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": 'application/json'
            }
        }).then((response)=>{
            
            if(response.data.success === 1 && response.data.message ==="ok" && response.data.data){
                setDocumentUrl(null);
                setPatientData(response.data.data);
    
                setDocumentRejected(JSON.parse(response.data.data.Documentrejectreason)); 
             
            }
            else{
                 console.log(response)
            } 
        }).catch((error) => {
            console.log(error);
        }) 


    }



   const DocumentRejectHandler =()=>{

    setDDescriptionOn(true);
    setIsDocumentReviewed(true);

   }

   const DocumentAproveHandler =()=>{
    
    setIsDocumentReviewed(true);
    // setIsReviewed(true);
        const data ={
            appid:process.env.REACT_APP_ID,
            requestid:patientData.requestid,
            content:'Document'
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
    navigator.clipboard.writeText(`https://meindoc.app/patients/${patientData.requestid}`);
  
  }

    return (

            <Page title="Detailed View">
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            {t('Detail')}
                        </Typography>
                        {
                            patientData.hospital ==="NHS" && 
                            <Button variant="contained" component={RouterLink} to="/NHS/requests" startIcon={<Iconify icon="bx:arrow-back" />}>
                            {t('Back')}
                            </Button>
                            ||
                            <Button variant="contained" component={RouterLink} to="/home/list" startIcon={<Iconify icon="bx:arrow-back" />}>
                            {t('Back')}
                           </Button>
                        }
                       
                    </Stack>
{/* video section */}
                    <Card>  
                        <Stack direction="column" justifyContent="space-between" m={5} spacing={3}>
                            <Data name={patientData.patientname} requestid={patientData.requestid} data={patientData} buttonenable={"disabled"} />
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
                                            {`https://meindoc.app/patients/`} <IconButton aria-label="delete" color={'primary'} size="small" onClick={handleCopy}>
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
                            {/* document section section  */}
                            <Card >
                                <Grid item xs={8} m={2}>
                                    <Typography variant="h5" gutterBottom mb={2}>
                                        Document
                                    </Typography>
                                    <Grid item xs={6} mb={2}>
                                    {
                                        DocumentUrl && (DocumentUrl !== null) && (DocumentUrl !== undefined) && <div>
                                        <Grid item xs={12} p={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                            
                                            {/* <PDFViewer
                                                document={{
                                                    url: DocumentUrl,
                                                }}
                                            /> */}
                                            <iframe src={DocumentUrl} title="Uploaded document"  width="100%" height="520px"/>
                                            <br />
                                            {/* <a href={videoUrl} rel="noreferrer" target={"_blank"}>{videoUrl.split('/').pop()}</a> */}
                                        </Grid>
                                        {
                                            patientData.status !== 'complete' &&  data.role === 'doctor' && !isDocumentReviewed && !patientData.documentVerified &&
                                            <Grid item xs={6}>
                                            <Stack direction="row" justifyContent="end" spacing={2}>
                                                <Button variant="outlined" startIcon={<Iconify icon="bx:dislike"/>} color="error" onClick={DocumentRejectHandler}>
                                                    {t('Reject')}
                                                </Button>
                                                <Button variant="contained" endIcon={<Iconify icon="bx:like" />} color="success" onClick={DocumentAproveHandler}>
                                                    {t('Approve')}
                                                </Button>
                                            </Stack>
                                            </Grid>

                                        }
                                        {
                                         DdescriptionOn && 
                                         <Grid container spacing={3}>
                                             <Grid item xs={8}>
                                                    <TextField
                                                    id="ddescription"
                                                    label="Tell us why...?"
                                                    multiline
                                                    rows={4}
                                                    variant="filled"
                                                    fullWidth
                                                    onChange={(e)=>{
                                                        setDDescription(e.target.value);
                                                    }}
                                                    />
                                             </Grid>
                                             <Grid item xs={4} alignSelf={"end"} pb={1}  textAlign={"center"}>
                                             <Button variant="outlined"  endIcon={<Iconify icon="mdi:send" />} onClick={RejectDocumnetUpdateDescription}>
                                                Send
                                             </Button>
                                            </Grid>
                                        </Grid>
                                        }     
                                        </div>
                                        ||
                                        <Grid item xs={6} >
                                            <Label color={'error'} fontSize="2rem">No document available</Label>
                                        </Grid>

                                    }
                                    {
                                        data.role === 'worker' && !DocumentUrl &&
                                        <Grid item xs={6} mt={3}>
                                           <Document func={getDocumentData} />
                                        </Grid>
                                    }
                                    </Grid>
                                </Grid>
                            </Card>

                                 {
                                       documentRejected && documentRejected.length > 0 &&   <Card >
                                        <Grid item xs={8} m={2}>
                                            <Typography variant="h6" gutterBottom>
                                              Document Rejected History 
                                            </Typography>
                                         {documentRejected.map((result, index)=>(
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
                                    <Typography variant="h5" gutterBottom mb={2}>
                                        Image Reference
                                    </Typography>
                                    <Grid item xs={6} mb={2}>
                                    {
                                        patientData.referanceimage && 
                                        <Grid item xs={8} p={1}>

                                            <CardMedia
                                                component='img'
                                                className={"MuiCardMedia-img"}
                                                src={patientData.referanceimage}
                                            />
                                            <br />
                                            {/* <a  style={{width:"100%"}} href={patientData.referanceimage} rel="noreferrer" target={"_blank"}>{(patientData.referanceimage).split('/').pop()}</a> */}
                                            </Grid>
                                        ||
                                        <Grid item xs={6} >
                                            <Label color={ 'error'} fontSize="2rem">Reference image is Not available</Label>
                                        </Grid>

                                    }
                                </Grid>
                                </Grid>
                            </Card>
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
                            <Card >
                                <Grid item xs={8} m={2}>
                                    <Typography variant="h5" gutterBottom mb={2}>
                                        Reports
                                    </Typography>
                                    <Grid item xs={6} mb={2}>
                                    {reportshtml} 
                                </Grid>      
                                </Grid>
                            </Card>
                        </Stack>
                    </Card>
                </Container>
            </Page>
        )
}

export default Request