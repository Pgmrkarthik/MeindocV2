import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import Patients from './PatientLogin';

function PatientHome() {
  // const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(location.state || null);

  return (
    <>
      {
        data &&
        <Container>
          {
            data.videoUrl === null &&
            <Container>
              <Patients />
            </Container>
          }

          {
            data && data.videoUrl !== null &&
            <Grid item xs={12} p={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={15}>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Request ID :{data.requestid}</Typography>

              <CardMedia
                component='video'
                className={""}
                controls
                src={JSON.parse(data.videoUrl)[0].file}
                autoPlay
                sx={{
                  maxHeight: '750px',
                }}
              />
              <br />
              {/* <a href={videoUrl} rel="noreferrer" target={"_blank"}>{videoUrl.split('/').pop()}</a> */}
            </Grid>
          }

          {
            data.description && <>
                                  <Typography variant="h7" gutterBottom>
                                    <b>Message</b> 
                                  </Typography>
                                  <Grid item xs={6} mb={2}>
                                    <Typography>{data.description}</Typography>
                                  </Grid>
            
                                </>
          }


        </Container> 
        
        ||
        <Patients />
      }
    </>
  )



}

export default PatientHome;