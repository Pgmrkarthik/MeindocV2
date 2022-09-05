import React from 'react';
import { useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Box, Grid,Typography,Button,Stack,IconButton} from '@mui/material';
import Iconify from '../../components/Iconify';
import Label from '../../components/Label';
import useResponsive from '../../hooks/useResponsive';

function Data({ name, requestid, data, buttonenable,status, reloadfunc}) {

  const smUp = useResponsive('up', 'sm');
  const navigate = useNavigate();
  const {t} = useTranslation();

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
              (buttonenable ==="enabled" && data.hospital ==="NHS") &&  
              <Grid>
              <Button variant="text"  onClick={() => navigate(`/NHS/${data.requestid}`,{state:data})}>
              {t('View')}
            </Button>
            </Grid>
            }
            {
              buttonenable ==="enabled" && data.hospital !== "NHS" &&
              <Grid>
              <Button variant="text"  onClick={() => navigate(`/dashboard/${data.requestid}`,{state:data})}>
                      {t('View')}
                    </Button>
            </Grid>
            }       
        </Grid>
        
      </Box>
    </Card>
  );
}
export default Data;
