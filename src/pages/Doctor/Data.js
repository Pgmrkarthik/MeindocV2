import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Box, Grid,Typography,Button,Stack,IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
 } from '@mui/material';
import axios from 'axios';

// Components 
import Iconify from '../../components/Iconify';
import Label from '../../components/Label';

// Hooks
import useResponsive from '../../hooks/useResponsive';
import { _Connections } from '../../_Connections';

function RemoveDialogComponent(props) {
   const {onClose,open} = props;
   const {t} = useTranslation();

    const handleCancel = () => {
      onClose();
    };
    const handleOk = () => {
      onClose(true);
    };

return (
     <Dialog open={open}>
        <DialogTitle>{t('Are you sure to remove request')}?</DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
          {t('Cancel')} 
          </Button>
          <Button onClick={handleOk}>{t('Ok')}</Button>
       </DialogActions>
     </Dialog>
  )
}



function Data({ name, requestid, data, buttonenable,status, reloadfunc}) {

  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const user = JSON.parse(localStorage.getItem('data'));
  const [open, setOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const removeRequest = () => {
    const requestdata = {
        appid:process.env.REACT_APP_ID,
        requestid:data.requestid,
        status:'Remove'
    }
    axios({
        method: "POST",
        url: _Connections._apiroot+"/api/Delete_request.php",
        data: JSON.stringify(requestdata),
        headers: {
            "Content-Type": 'application/json'
        }
    }).then((response)=>{
        if(reloadfunc){
          reloadfunc(true);
        }
        else if(data.hospital ==="NHS"){  
              navigate('/NHS/requests'); 
        }
        else{
          navigate('/dashboard/user');
        }
    }).catch((error) => {
        console.log(error);
    });
  }

//   Dialog component handlers..............................
const handleEditClick = () =>{
  setOpen(true)
}
const handleClose = (value) =>{
  if(value){
     removeRequest();
     setConfirmRemove(value);
     if(confirmRemove){
        removeRequest();
     }
  }
  else{
    setConfirmRemove(false);
  }
  setOpen(false);
}

const handleCopy = ()=>{
  navigator.clipboard.writeText(requestid);

}

  return (
    
    <Card>
        <Stack direction="row" justifyContent="end" pr={5} mt={1} spacing={2}>
          <Label mt={3} 
              color={((data.status === 'pending' || data.status === 'rejected') && 'error') || 'success'}
          >
             {t(data.status)} 
          </Label>
                                  
        </Stack>
        <RemoveDialogComponent
            id="removeconformation"
            keepMounted
            open={open}
            onClose={handleClose}
            />
      <Box m={2}>  
        <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 1, md: 1 }}  direction={{ xs: 'column', sm: 'row' }}>
          <Grid  item xs={6} >
              <Grid item >
                <Typography fontWeight={"bold"} fontSize={'1.0rem'}>{name}</Typography>
                {
                  data.patientID &&
                  <Typography fontSize={'0.8rem'}>Patient Id : {data.patientID}</Typography> 
                }  
              </Grid>
              <Grid item>
                <Typography fontWeight={400}  fontSize={'0.8rem'}>{requestid} <IconButton aria-label="delete" color={'primary'} size="small" onClick={handleCopy}>
                     <Iconify fontSize={16} icon="mdi:content-copy"/>  
                     </IconButton>
                </Typography> 
              </Grid>
          </Grid>
          {
            smUp &&
            <Grid  item xs={6}>
              <Grid item>
              <Typography><b>{t('Created')}  : </b>{data.createdat.slice(0, 10)}</Typography> 
              </Grid>
            
              <Grid item>
              <Typography fontWeight={400} fontSize={'0.8rem'}>{data.surgeryname}</Typography> 
              </Grid>
            </Grid>
          }
            {
              buttonenable ==="enabled"  &&
              <Grid>
              <Button variant="text"  onClick={() => navigate(`/NHS/${data.requestid}`,{state:data})}>
              {t('View')}
              </Button>
              </Grid>
            }
            {
              buttonenable ==="enabled" &&
              <Grid>
                <Button variant="text"  onClick={() => navigate(`/dashboard/${data.requestid}`,{state:data})}>
                      {t('View')}
                </Button>
              </Grid>
            }
            <Stack justifyContent="end" pb={1} spacing={2} fullWidth>
               <IconButton aria-label="delete" style={{ position:'absolute' ,right: '40px'}} color={'error'} size="small" onClick={handleEditClick}>
               <Iconify icon="mdi:delete"/>  
               </IconButton>
            </Stack>
        </Grid>
      </Box>
    </Card>

  );
}

export default Data;
