
// material
import { Card, Grid, Button, Container, Stack, Typography,Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
// components
import Page from '../components/Page';
import NHSNewRequesstForm from '../sections/newrequest/NHS_NewRequesstForm';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function NHSNewrequest() {

  const {t} = useTranslation();
  return (
    <Page title="New Request">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
           {t('New request')}
          </Typography>
        </Stack>
           <Card>
           <Box margin={5}>
              <NHSNewRequesstForm />
            </Box>
           </Card>   
      </Container>
    </Page>
  );
}
