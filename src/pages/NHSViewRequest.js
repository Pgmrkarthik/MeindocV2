import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// material
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Autocomplete,
  TextField,
  InputBase,
  Input,
  InputAdornment,
  Grid
} from '@mui/material';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import RequestComponent from './RequestComponent';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

// mock


export default function NHSViewRequest() {

  const localdata = JSON.parse(localStorage.getItem("data"));

  const [refreshloading,setRefreshLoading] = useState(false);
  // const [page, setPage] = useState(0);

   const [searchTerm, setSearchTerm] = useState('');

   const [filter, setFilter] = useState('');

   const [orderBy, setOrderBy] = useState('');

  const [patients, setPatients] = useState();

  const [data, setData] = useState();

  const [filterData, setFilterData] = useState();

  const {t} = useTranslation();



    const requestdata = {
      appid:process.env.REACT_APP_ID,
      doctorid:localdata.id,
      role:localdata.role
    }
    useEffect(() => {
     loadData();
    }, []);
    

    const loadData = async () =>{
      const response = await fetch('https://meindoc.app/backend/api/NHSgetpatientbydoctor.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestdata)
      })
      const data = await response.json();
      setData(data.patients);
      setFilterData(data.patients);
      setRefreshLoading(false) 
    }
    
    const handlingReferesh =()=>{
      setRefreshLoading(true)
      setFilter();
      setOrderBy();
      setSearchTerm('');
      loadData();
      // window.location.reload(false)       
    }
    // const filterValue = "pending";
    // const filterType = "status";
    const filterFunction =(value)=>{
      if(value ==="All"){
        setFilterData(data);
        return 
      }
      const Value = data.filter((list)=>list.status === value);
      setFilterData(Value)
    }
    const applySortFilter =(value)=>{
      if(value ==="none"){
        return
      }
      const data = filterData;
    
      filterData.sort((a,b)=>{
        
        if (a[value] === b[value]){
          return 0;
        }
        return a[value]> b[value] ? 1 : -1; 
      });
   
      setFilterData(filterData)
    }
//

  const reload = ()=>{
    loadData();
  }

    const searchTermChangeHandler = (event)=>{
        setSearchTerm(event.target.value);
        if(searchTerm !==''){
              const newsearchList =data.filter((item)=>{
              return Object.values(item)
                .join('').toLowerCase()
                .includes(searchTerm.toLowerCase())
              
              });
              setFilterData(newsearchList);
        }
        else{
          setFilterData(data);
        } 
    }


    const handleChangefilters = (event) => {
   
      setFilter(event.target.value);
      filterFunction(event.target.value)
      
    };
    
    const handleChangeSortFilter = (event) => {
      setOrderBy(event.target.value);
      applySortFilter(event.target.value);

    }

  return (
    <Page title="Requests">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
              {t('Requests')}
          </Typography> 
          
           <LoadingButton id="refresh" variant="text"
            onClick={handlingReferesh} 
            startIcon={<Iconify icon="mdi:refresh" />} 
            loading={refreshloading} 
            loadingPosition="end"/>
          {
            localdata.role ==='doctor' &&<Button variant="contained" component={RouterLink} to="/NHS/newrequest" startIcon={<Iconify icon="eva:plus-fill" />}>
            {t('New request')}
          </Button>
          }   
        </Stack>

        {/* filter form controls */}
       
        
         <Stack direction="row" alignItems="center" justifyContent="start"  mb={1}>
         <Input placeholder={t('search')}
         onChange={searchTermChangeHandler}
         value={searchTerm}
         startAdornment={
          <InputAdornment position="start">
            <Iconify icon="il:search" />
          </InputAdornment>
         }
         
         />
         <FormControl sx={{ m: 1, minWidth: 120 }} size="small">  
         <InputLabel id="filter">{t('filter')}</InputLabel>
              <Select
                labelId="filter"
                id="filters"
                value={filter}
                label={t('filter')}
                onChange={handleChangefilters}
              >
                <MenuItem value="All">
                  <em>{t('All')}</em>
                </MenuItem>
                <MenuItem value={'pending'}>{t('pending')}</MenuItem>
                <MenuItem value={'review'}>{t('review')}</MenuItem>
                <MenuItem value={'rejected'}>{t('rejected')}</MenuItem>
                <MenuItem value={'complete'}>{t('completed')}</MenuItem>
                
                {/* <MenuItem value={30}></MenuItem> */}
              </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small"> 
              <InputLabel id="sort">{t("sort by")}</InputLabel>
              <Select
                labelId="sort"
                id="orderby"
                value={orderBy}
                label="sort"
                onChange={handleChangeSortFilter}
              >
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem> */}
                <MenuItem value={'patientname'}>Name</MenuItem>
                <MenuItem value={'createdat'}>Date</MenuItem>
                {/* <MenuItem value={30}></MenuItem> */}
              </Select>
            
            </FormControl>
            </Stack>

           
            
        <Card>
        <Stack direction="column"  justifyContent="space-between" m={5} spacing={3}>

          {filterData && filterData.length > 0 && 
            filterData.map((result, index) =>(
              <RequestComponent key={index} name={result.patientname}  requestid={result.requestid} data={result} buttonenable={"enabled"} reloadfunc={reload}/>
            ))
            ||
            <Stack direction="row"  justifyContent="center" m={2}>
              <Typography>{t('No available data')}</Typography>
            </Stack>
          }
          </Stack>

        </Card>
      </Container>
    </Page>
  );
}
