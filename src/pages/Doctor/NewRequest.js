
// material
import { Card,Container, Stack, Typography,Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// components
import Page from '../components/Page';
import NewRequesstForm from '../sections/newrequest/NewRequesstForm';


export default function NewRequest() {
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
              <NewRequesstForm />
            </Box>
           </Card>
      </Container>
    </Page>
  );
}
