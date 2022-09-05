import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
// material UI components
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
  Input,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "../components/Iconify";

import Page from "../components/Page";
import { authenticationService } from "../services/authservices";
import { userService } from "../services/user.services";
import { Role } from "../helpers/Role";
import { history } from "../helpers/history";
import  RequestComponent from "./RequestComponent";

//  Page ["ViewRequests" => /home/list]
export default function ViewRequests() {
  // state variables
  const CurrentUser = authenticationService.currentUserValue;
  const [refreshloading, setRefreshLoading] = useState(false);

  // filter, search, orderby
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [orderBy, setOrderBy] = useState(""); //  RW

  const [patientList, setPatientList] = useState([]); // set patients list get by user Service
  const [filteredPatientList, setfilteredPatientList] = useState([]); // set all filter patientList get (filte, search, orderby)

  const { t } = useTranslation();

  useEffect(() => {
    if (!authenticationService.tokenValue) {
      history.push("/login");
      window.location.reload();
    }
    fetchPatientList();
  }, []);

  const fetchPatientList = () => {
    userService.getAllRequest().then(
      (user) => {
        setPatientList(user.patients);
        setfilteredPatientList(user.patients);
      },
      (error) => console.log(error)
    );
  };

  // refresh patient list

  const _RefreshHandler = () => {
    setRefreshLoading(true);
    setFilter();
    setOrderBy();
    setSearchTerm("");
    fetchPatientList();
  };

  const filterFunction = (value) => {
    if (value === "All") {
      setfilteredPatientList(patientList);
      return;
    }
    const Value = patientList.filter((list) => list.status === value);
    setfilteredPatientList(Value);
  };

  const applySortFilter = (value) => {
    if (value === "none") {
      return;
    }
    filteredPatientList.sort((a, b) => {
      if (a[value] === b[value]) {
        return 0;
      }
      return a[value] > b[value] ? 1 : -1;
    });
    setfilteredPatientList(filteredPatientList);
  };

  const reload = () => {
    fetchPatientList();
  };

  const searchChangeHandler = (event) => {
    setSearchTerm(event.target.value);
    if (searchTerm !== "") {
      const newsearchList = patientList.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setfilteredPatientList(newsearchList);
    } else {
      setfilteredPatientList(patientList);
    }
  };

  const handleChangefilters = (event) => {
    setFilter(event.target.value);
    filterFunction(event.target.value);
  };

  const handleChangeSortFilter = (event) => {
    setOrderBy(event.target.value);
    applySortFilter(event.target.value);
  };

  return (
    <Page title="Requests">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {t("Requests")}
          </Typography>

          <LoadingButton
            id="refresh"
            variant="text"
            onClick={_RefreshHandler}
            startIcon={<Iconify icon="mdi:refresh" />}
            loading={refreshloading}
            loadingPosition="end"
          />
          {CurrentUser.role === Role.DOCTOR && (
            <Button
              variant="contained"
              component={RouterLink}
              to="/createRequest"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              {t("New request")}
            </Button>
          )}
        </Stack>

        {/* [filter,sort,search] form controls */}
        <>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="start"
            mb={1}
          >
            {/* Search Component */}
            <Input
              placeholder={t("search")}
              onChange={searchChangeHandler}
              value={searchTerm}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="il:search" />
                </InputAdornment>
              }
            />

            {/* FilterComponent */}
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="filter">{t("filter")}</InputLabel>
              <Select
                labelId="filter"
                id="filters"
                value={filter}
                label={t("filter")}
                onChange={handleChangefilters}
              >
                <MenuItem value="All">
                  <em>{t("All")}</em>
                </MenuItem>
                <MenuItem value={"pending"}>{t("pending")}</MenuItem>
                <MenuItem value={"review"}>{t("review")}</MenuItem>
                <MenuItem value={"rejected"}>{t("rejected")}</MenuItem>
                <MenuItem value={"complete"}>{t("completed")}</MenuItem>
              </Select>
            </FormControl>

              {/* OrderByComponent */}
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="sort">{t("sort by")}</InputLabel>
              <Select
                labelId="sort"
                id="orderby"
                value={orderBy}
                label="sort"
                onChange={handleChangeSortFilter}
              >
                <MenuItem value={"patientname"}>Name</MenuItem>
                <MenuItem value={"createdat"}>Date</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </>

                {/* Main Page Layout */}
        <Card>
          <Stack
            direction="column"
            justifyContent="space-between"
            m={5}
            spacing={3}
          >
            {(filteredPatientList &&
              filteredPatientList.length > 0 &&
              filteredPatientList.map((result, index) => (
                <RequestComponent
                  key={index}
                  name={result.patientname}
                  requestid={result.requestid}
                  request={result}
                  status={result.status}
                  reloadfunc={reload}
                />
              ))) || (
              <Stack direction="row" justifyContent="center" m={2}>
                <Typography>{t("No available patient")}</Typography>
              </Stack>
            )}
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
