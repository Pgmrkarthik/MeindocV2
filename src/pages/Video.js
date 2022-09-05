import React,{useState, useEffect,useRef,useMemo} from 'react';
import {useParams } from 'react-router-dom';
import Dropzone,{useDropzone} from 'react-dropzone';
import axios, {CancelToken, isCancel} from 'axios';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { LoadingButton } from '@mui/lab';
import {LinearProgress,Box, Typography, Button, Stack} from '@mui/material';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import { isArray } from 'lodash';

import {config} from '../config';
import { authHeader } from '../helpers/authHeader';




LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function Video(props) {

     const {requestid} = useParams();
     const [progress, setProgress] = useState(0);
     const [loading, setLoading] = useState(false);
     const [uploaded, setUploaded] = useState(false);
     const [files, setFiles] = useState([]);
     const [fileuploadresponse, setFileuploadresponse] =useState(false);
     const [errorresponse, setErrorresponse] = useState(false);
     const cancelFileupload = useRef(null);

     const {acceptedFiles, getRootProps, getInputProps, isFocused,
      isDragAccept,
      isDragReject} = useDropzone({accept: {
        'video/mp4': ['.mp4'],
      }
    });

const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isFocused,
        isDragAccept,
        isDragReject
      ]);

const destroyDropzone =() =>{
      setFiles([]);
      setLoading(false);
      setProgress(0);
    }
const OnUploadHadler = () =>{
      const formData = new FormData();
      formData.append('requestid',requestid);
      formData.append('appid',process.env.REACT_APP_ID);
      files.forEach((file)=>{
        formData.append("files[]",file);
      });
      sendUpoad(formData,setProgress); 
    };
const sendUpoad= (formData)=>{
      axios({
        method: "POST",
        headers: authHeader(),
        url:`${config.DP_ROOT_URL}/upload_video.php`,
        data: formData,
        cancelToken : new CancelToken(cancel =>{
          cancelFileupload.current = cancel
        }),
        onUploadProgress: (progressEvent) =>{
                setLoading(true);
                if (progressEvent.lengthComputable) {
                
                  setProgress(progressEvent.loaded/progressEvent.total*100);
                }
                if(progressEvent.loaded === progressEvent.total){

                  destroyDropzone();
                }
              }
      }).then((response)=>{
        console.log(response);
        if(response.data.success){
          props.func(response.data[0].file);
          console.log("hello")
          setFileuploadresponse(true);
          setUploaded(true);
    
          const rid = requestid
          const datas = {
            appid:process.env.REACT_APP_ID,
            requestid:rid,
          }
          axios({
            method: "POST",
            url: "https://meindoc.app/backend/mailservices/mail.php",
            data:JSON.stringify(datas),
            headers: {
              "Content-Type": "application/json"
            }
          });
          setTimeout(()=>{
            setFileuploadresponse(false);
       
          },3000);
        }
        else{
          setErrorresponse(true);
          setTimeout(()=>{
            setErrorresponse(true)
          },3000);
        }
      }).catch((error)=>{
        if(isCancel(error)){
          alert(error.message);
        }
       
      });
    }
    useEffect(()=>{
      setFiles(acceptedFiles)
    },[acceptedFiles])
    const cancelUpload =()=>{
      if(cancelFileupload.current){
        cancelFileupload.current("File upload cancelled!")
        destroyDropzone();
      }
    } 

  return (
    <section className="container">
     <Stack spacing={2}>
         {
             uploaded ||
              <Stack spacing={2}>
                <Dropzone>
                    {() => (
                    <div className="container">
                      <div {...getRootProps({style})}
                      {...getRootProps({className: 'dropzone'})}>
                        <input name="files[]"  {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                      </div>
                      </div>
                    )}
                </Dropzone> 
             <h5 style={{color:'darkgray',fontWeight:400,fontStyle: 'italic'}}>Note : only (.mp4) accepted</h5>
             <aside>
               <h5>Video</h5>
               {files.map((file,index)=>{
                return <li key={index}>{file.path} - {((file.size/1020)/1020).toFixed(1)} MB</li>
               })}
             </aside>
             </Stack>
         }
      {
        progress > 0 &&
        <Box sx={{ '& > button': { m: 1 } }}>
          <LinearProgressWithLabel value={progress} />
          <Button color="error" onClick={cancelUpload}>Cancel</Button>
        </Box> 
      }
      {files.length>0 &&
              <LoadingButton startIcon={<CloudUploadIcon />} variant="contained" loadingPosition="start" loading={loading} onClick={OnUploadHadler}
              sx={{
                width:"150px"
              }}>
              upload video
             </LoadingButton>
      }
      {fileuploadresponse && 
          <Alert variant="outlined" severity="success">Video Upload Completed</Alert>
      } 
      {errorresponse && 
          <Alert variant="outlined" severity="error">Video not upload</Alert>
      } 
      </Stack>    
  </section>
  )
}

export default Video   