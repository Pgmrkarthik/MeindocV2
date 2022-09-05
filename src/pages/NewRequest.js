
// material
import { Card,Container, Stack, Typography,Box } from '@mui/material';
import { useTranslation } from 'react-i18next';


import Page from '../components/Page';
import NewRequestForm from '../sections/newrequest/NewRequestForm';


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
              <NewRequestForm />
            </Box>
           </Card>
      </Container>
    </Page>
  );
}
