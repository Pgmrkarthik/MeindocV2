import React, { useState, useRef, useEffect,Suspense } from 'react';
import { Grid, Stack, Button,Box,Alert,Typography } from '@mui/material';
import Container from '@mui/material/Container';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import {useParams,useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isArray } from 'lodash';
import useResponsive from '../../hooks/useResponsive';
import Iconify from '../../components/Iconify';

import { authHeader } from '../../helpers/authHeader';
import { config } from '../../config';



const imagereference =[
  {
    value: 'kidney',
    src: '/static/imagereference/ImageReference_Kidney.png',
  },
  {
    value: 'prostate',
    src: '/static/imagereference/ImageReference_Prostate.png',
  },
  {
    value: 'Bladder',
    src: '/static/imagereference/ImageReference_Bladder.png',
  }
]

function AddImageReferences({propsData}) {

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const {t} = useTranslation();
  const data = localStorage.getItem('surgery_type'); //  getting data from LocalStorage
  const {requestid} = useParams();
  const navigate = useNavigate();
  const [fileuploadresponse,setFileuploadresponse]= useState()
  const [errorresponse,setErrorresponse]= useState();
  const [brush, setBrush] = useState('#FFFFFF');
  const [thick, setThick] = useState(8);
  const [referenceimage, setReferenceimage] = useState(imagereference[0].src);

  const [newImage, setImage] = useState('');
  const canvasRef = useRef(null);

  const style = {
    width: `${thick}px`,
    background: brush,
    marginLeft: '50%',
  };

  const setImagereference =()=>{
    console.log(data)
    if(data.surgery_type === 'BLTR' || data.surgery_type === 'BLSTONE' || data.surgery_type === 'CYSTOS'){
      setReferenceimage(imagereference[2].src);
    }
    else if(data.surgery_type === 'PROPEN' || data.surgery_type === 'PROROBOTIC' || data.surgery_type ==='PROLAPRO'){
      setReferenceimage(imagereference[1].src)
    }
    else{
      setReferenceimage(imagereference[0].src)
    }

  }
  useEffect(()=>{
    setImagereference();
  },[])
 // uploading reference image
  const sendReferenceImage = (formData) => {
    axios({
      method: "POST",
      url: `${config.DP_ROOT_URL}/upload_reference.php`,
      data: formData,
      headers:authHeader(),
  }).then((response)=>{
    if(response.data.success){
      localStorage.removeItem("surgery_type");
      setFileuploadresponse(true)
      setTimeout(()=>{
        canvasRef.current.clear();
        setFileuploadresponse(false);
        navigate(`/home/list/`);
      },3000);
    }
    else{
      setErrorresponse(true);
      setTimeout(()=>{
        setErrorresponse(false)
      },3000);
    }
  })
}
  return (
    <Container> 
     <Box m={3}>
     {fileuploadresponse && 
          <Alert variant="outlined" severity="success">{t('File Upload Completed')}</Alert>
      } 
      {errorresponse && 
          <Alert variant="outlined" severity="error">{t('File not upload')}</Alert>
      } 
     </Box>
      {/* <Grid container mt={3} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}> */}
      <Stack spacing={4} direction="row" mb={2}>
          <div>     
            <div className="thickness" style={style} />
            <p>color</p>
            <input
              style={{ background: { brush } }}
              type="color"
              value={brush}
              onChange={(event) => {
                setBrush(event.target.value);
              }}
            />
            </div>
            <div>
            <div className="thickness" style={style} />
            <p>Brush</p>
            <input
              min="2"
              max="50"
              type="range"
              value={thick}
              onChange={(event) => {
                setThick(event.target.value);
              }}
            />
            </div>
            </Stack>
      <Grid  item xs={12}  paddingY={1}>
      <Suspense fallback={(<div>Loading....</div>)}>
      {
        mdUp &&
        <CanvasDraw
        ref={canvasRef}
        brushColor={brush}
        brushRadius={thick}
        lazyRadius={0}
        canvasWidth={700}
        canvasHeight={400}
        hideGrid="true"
        hideInterface="false"
        imgSrc={referenceimage}
        style={{
          boxShadow: '0 13px 27px -5px rgba(50, 50, 93, 0.25),  0 8px 16px -8px rgba(0, 0, 0, 0.3)',
        }}
      />
      || smUp && 
      <CanvasDraw
      ref={canvasRef}
      brushColor={brush}
      brushRadius={thick}
      lazyRadius={0}
      canvasWidth={450}
      canvasHeight={260}
      hideGrid="true"
      hideInterface="false"
      imgSrc={referenceimage}
      style={{
        boxShadow: '0 13px 27px -5px rgba(50, 50, 93, 0.25),  0 8px 16px -8px rgba(0, 0, 0, 0.3)',
      }}
      />
      || <Grid container m={1} justifyContent='center' textAlign='center' direction="row">
               <Iconify icon="mdi:phone-rotate-landscape"/>
               <Typography sx={{ color: 'text.secondary', paddingLeft:'10px'}}>
                {t('Please rotate your mobile in Landscape')}  
               </Typography>
               
          </Grid>
      }
      </Suspense>
        </Grid>


        {
          (mdUp || smUp) &&
          <Stack spacing={5} mt={2} direction="row">
          <Button  variant="contained" size="small" 
            onClick={() => {
              canvasRef.current.undo();
            }}
          >
            UNDO
          </Button>
          <Button variant="contained" size="small"
            onClick={() => {
              canvasRef.current.clear();
            }}
          >
            CLEAR
          </Button>


       <Button variant="contained" size="small"
            onClick={() => {
              const width = canvasRef.current.props.canvasWidth;
              const height = canvasRef.current.props.canvasHeight;
              const backgroundImage = canvasRef.current.canvasContainer.children[0];     //   background Image
              const drawing = canvasRef.current.canvasContainer.children[1];             //   Drawing
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              canvas.getContext('2d').drawImage(backgroundImage, 0, 0);
              canvas.getContext('2d').globalAlpha = 1.0; 
              canvas.getContext('2d').drawImage(drawing, 0, 0);
              const dataUri = canvas.toDataURL('image/png', 1.0);
              setImage(dataUri);
              fetch(dataUri)
              .then(res => res.blob())
              .then(blob => {
                const formData = new FormData()
                formData.append("files[]",blob,"refernceimage.png");
                formData.append('requestid',requestid); 
                formData.append('appid',process.env.REACT_APP_ID);
                sendReferenceImage(formData)
              })
            }}
          >
            UPLOAD
          </Button>
        </Stack>
        }
         
      {/* </Grid> */}

      
    </Container>
  );
}

export default AddImageReferences;
