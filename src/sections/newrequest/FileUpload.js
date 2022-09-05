import React,{useState, useEffect,useRef,useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate,useParams } from 'react-router-dom';
import Dropzone,{useDropzone} from 'react-dropzone';
import axios, {CancelToken, isCancel} from 'axios';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { isArray } from 'lodash';
import { LoadingButton } from '@mui/lab';
import {LinearProgress,Box, Typography, Button, Stack} from '@mui/material';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Iconify from '../../components/Iconify';

import { authHeader } from '../../helpers/authHeader';
import {config} from '../../config';
import { handleResponse } from '../../helpers/handle_response';



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





function FileUpload() {

     const {t} = useTranslation();  
     const {requestid} = useParams();
     const navigate = useNavigate();

     const [progress, setProgress] = useState(0);
     const [loading, setLoading] = useState(false);
     const [nextpage, setNextpage] = useState(false);
     const [files, setFiles] = useState([]);
     const dropzone = useRef(null);
     const [fileuploadresponse, setFileuploadresponse] =useState(false);
     const [errorresponse, setErrorresponse] = useState(false);
     const cancelFileupload = useRef(null);

     const {acceptedFiles, getRootProps, getInputProps, isFocused,
      isDragAccept,
      isDragReject} = useDropzone({accept: {
        'image/*': ['.png','.jpeg'],
        'application/pdf': ['.pdf']
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
      files.forEach((file,index)=>{
       
        formData.append("files[]",file);
      });
      sendUpoad(formData,setProgress);
      
    };


    const sendUpoad= (formData)=>{
     
      axios({
        method: "POST",
        url: `${config.DP_ROOT_URL}/upload_file.php`,
        data: formData,
        headers:authHeader(),
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
        if(response.data.success){
          setFileuploadresponse(true)
          setNextpage(true);
          setTimeout(()=>{
            setFileuploadresponse(false);
            navigate(`/${requestid}/UploadReference`,{requestid});
          },3000);
        }
        else{
          setErrorresponse(true);
          setTimeout(()=>{
            setErrorresponse(false)
          },3000);
        }
      }).catch((error)=>{
        if(isCancel(error)){
          alert(error.message);
        } 
      });
    }
    useEffect(()=>{
      setFiles(acceptedFiles);
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
          <Dropzone >
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
      <h5 style={{color:'darkgray',fontWeight:400,fontStyle: 'italic'}}>Note : only (.png, .jpg, .pdf) accepted</h5>
          <aside>
            <h4>Files</h4>
            {files.map((file,index)=>{
            return <li key={index}>{file.path} - {((file.size/1020)/1020).toFixed(1)} MB</li>
            })}
          </aside>
      {
        progress > 0 &&
        <Box sx={{ '& > button': { m: 1 } }}>
          <LinearProgressWithLabel value={progress} />
          <Button color="error" onClick={cancelUpload}>{t('Cancel')}</Button>
        </Box> 
      }
      {files.length>0 &&
              <LoadingButton startIcon={<CloudUploadIcon />} variant="contained" loadingPosition="start" loading={loading} onClick={OnUploadHadler}
              sx={{
                width:"150px"
              }}>
               {t('Upload')}
             </LoadingButton>
      }
      {fileuploadresponse && 
          <Alert variant="outlined" severity="success">File Upload Completed</Alert>
      } 
      {errorresponse && 
          <Alert variant="outlined" severity="error">File not upload</Alert>
      } 
    
         <Box
         sx={{
           display: 'flex',
           flexDirection: 'row-reverse',
           p: 1,
           m: 1,
           bgcolor: 'background.paper',
           borderRadius: 1,
         }}
        >
         <Button onClick={()=>{
            navigate(`/${requestid}/UploadReference`);
          }} variant="contained" endIcon={<Iconify icon="carbon:next-outline" />}> 
            Add Image Reference
          </Button>
       </Box>
      </Stack>    
  </section>
  )
}

export default FileUpload