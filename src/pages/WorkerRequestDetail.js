import React, { useState, useEffect } from 'react';
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

import authHeader from '../helpers/authHeader';
import { authenticationService } from '../services/authservices';



function WorkerRequestDetail() {

    const data = authenticationService.currentUserValue;
    const location = useLocation();
    const [patientData, setPatientData] = useState(location.state);
    const [videoUrl, setVideoUrl] = useState();
    const [DocumentUrl, setDocumentUrl] = useState();
    const [Rejected, setRejected] = useState([]);
    const [documentRejected, setDocumentRejected] = useState([]);
    const { t } = useTranslation();

    const setvideourlfunc = () => {
        if (patientData.VideoUrl !== null) {
            const values = JSON.parse(patientData.VideoUrl)
            setVideoUrl(values[0].file)
        }
    }

    const setdocumentUrlfunc = () => {
        if (patientData.documentUrl !== null) {
            console.log(patientData)
            const values = JSON.parse(patientData.documentUrl)
            setDocumentUrl(values[0].file);
        }
    }

    useEffect(() => {
        setvideourlfunc();
        setdocumentUrlfunc();
        setRejected(JSON.parse(patientData.rejectreason));
        setDocumentRejected(JSON.parse(patientData.Documentrejectreason));
    },[])

    let reportshtml;

    if (patientData.reportimage) {
        reportshtml = JSON.parse(patientData.reportimage).map((data, index) => {
            const filename = (data.file).split('/').pop()
            return (
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
 const handleCopyPatientVideoLink = () => {
    navigator.clipboard.writeText(`https://meindoc.app/patients/${patientData.requestid}`);
    }
    return (
        <Page title="Detailed View">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        {t('Detail')}
                    </Typography>
                        <Button variant="contained" component={RouterLink} to="/home/list" startIcon={<Iconify icon="bx:arrow-back" />}>
                            {t('Back')}
                        </Button>
                </Stack>

                {/* video section */}
                <Card>
                    <Stack direction="column" justifyContent="space-between" m={5} spacing={3}>
                        <Data name={patientData.patientname} requestid={patientData.requestid} request={patientData} hideViewButton={1} />
                        <Card >
                            <Grid item xs={8} m={2}>
                                <Typography variant="h5" gutterBottom mb={2}>
                                    Video
                                </Typography>
                                <Grid item xs={6} mb={2}>
                                    {
                                        patientData.status === 'complete' &&
                                        <Stack direction="row" mb={2}>
                                            <Label mt={3}
                                                color={'success'}
                                            >
                                                {`https://meindoc.app/patients/${patientData.requestid}`}<IconButton aria-label="delete" color={'primary'} size="small" onClick={handleCopyPatientVideoLink}>
                                                    <Iconify fontSize={16} icon="mdi:content-copy" />
                                                </IconButton>
                                            </Label>

                                        </Stack>
                                    }
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
                                                        maxHeight: '900px',
                                                    }}
                                                />
                                                <br />
                                            </Grid>
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
                            Rejected && Rejected.length > 0 && <Card >
                                <Grid item xs={8} m={2}>
                                    <Typography variant="h6" gutterBottom>
                                        Rejected History
                                    </Typography>
                                    {Rejected.slice(Rejected.length - 5 || 0, Rejected.length - 1).map((result, index) => (

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

                                                <iframe src={DocumentUrl} title="Uploaded document" width="100%" height="520px" />
                                                <br />

                                            </Grid>
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
                            documentRejected && documentRejected.length > 0 && <Card >
                                <Grid item xs={8} m={2}>
                                    <Typography variant="h6" gutterBottom>
                                        Document Rejected History
                                    </Typography>
                                    {documentRejected.map((result, index) => (
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
                                            <Label color={'error'} fontSize="2rem">Reference image is Not available</Label>
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
                                    {patientData.options !== null && JSON.parse(patientData.options).map((option, index) => (<div key={index}>
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

export default WorkerRequestDetail