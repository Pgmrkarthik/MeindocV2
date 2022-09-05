import { Link as RouterLink, useLocation,Route,useParams,useNavigate } from 'react-router-dom';
// material
import { Card, Grid, Button, Container, Stack, Typography,Box } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import FileUpload from '../sections/newrequest/FileUpload';


// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Newrequestfile() {

 const {requestid} =useParams();
 const navigate = useNavigate();

  return (
    <Page title="New Request file">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
         Reports
          </Typography>
        </Stack>
           <Card>
           <Box margin={5}>
                <FileUpload/>
            </Box>
           </Card>
       
      </Container>
    </Page>
  );
}
