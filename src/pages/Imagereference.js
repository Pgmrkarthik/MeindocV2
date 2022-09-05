import { Link as RouterLink,useParams,useNavigate } from 'react-router-dom';
// material
import { Card, Grid, Button, Container, Stack, Typography,Box } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import AddImageReferences from '../sections/newrequest/AddImageReferences';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Imagereference() {

  const {requestid} =useParams();
  const navigate = useNavigate();

  return (
    <Page title="New Request file">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
         Image
          </Typography>
          {/* <Button onClick={()=>{
            navigate(`/dashboard/user`,{requestid});
          }} variant="contained"  startIcon={<Iconify icon="carbon:task-view" />}>
            view
          </Button> */}
        </Stack>
           <Card>
           <Box margin={5}>
           <AddImageReferences />
          </Box>
           </Card>
      </Container>
    </Page>
  );
}
