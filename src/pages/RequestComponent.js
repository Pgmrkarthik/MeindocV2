import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Iconify from "../components/Iconify";
import Label from "../components/Label";
import useResponsive from "../hooks/useResponsive";

import { Role } from "../helpers/Role";
import {authenticationService } from "../services/authservices";
import { userService } from "../services/user.services";

// Request remove dialog component
function RemoveDialogComponent(props) {
  const { onClose, open } = props;
  const { t } = useTranslation();

  useEffect(() => { }, [open]);
  const handleCancel = () => {
    onClose();
  };
  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{t("Are you sure to remove request")}?</DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          {t("Cancel")}
        </Button>
        <Button onClick={handleOk}>{t("Ok")}</Button>
      </DialogActions>
    </Dialog>
  );
}

function RequestComponent({name, requestid,request, hideViewButton = false, status, reloadfunc}) {

  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");
  const user = authenticationService.currentUserValue;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const { t } = useTranslation();

  const removeRequest = () => {
    userService.removeRequestById(request.requestid).then(
      response =>{
            alert(response.message);
            reloadfunc(true);
            navigate('home/list/')
      },
      error =>{
        alert(error);
      }
    )
  };

  //    Dialog component handlers..............................
  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    if (value) {
      removeRequest();
      setConfirmRemove(value);
      if (confirmRemove) {
        removeRequest();
      }
    } else {
      setConfirmRemove(false);
    }
    setOpen(false);
  };

  // copy request id to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(requestid);
  };

  // route handler

  const handleRoute = () => {
  
    if(user.hospital === "NHS"){
      navigate(`/NHS/${requestid}`, { state: request });
    }
    else{
      navigate(`/Detail/${requestid}`, { state: request });
    }

  }
  return (
    <>
        {
          request && 
          <Card>
           <Stack direction="row" justifyContent="end" pr={5} mt={1} spacing={2}>
            <Label
          mt={3}
          color={
            ((request.status === "pending" || request.status === "rejected") &&
              "error") ||
            "success"
          }
        >
          {t(request.status)}
        </Label>
      </Stack>
      <RemoveDialogComponent
        id="removeconformation"
        keepMounted
        open={open}
        onClose={handleClose}
      />
      <Box m={2}>
        <Grid
          container
          rowSpacing={0}
          columnSpacing={{ xs: 1, sm: 1, md: 1 }}
          direction={{ xs: "column", sm: "row" }}
        >
          <Grid item xs={6}>
            <Grid item>

              <Typography fontWeight={"bold"} fontSize={"1.0rem"}>
                {name}
              </Typography>
              {request.patientID && (
                <Typography fontSize={"0.8rem"}>
                  Patient Id : {request.patientID}
                </Typography>
              )}

            </Grid>
            <Grid item>
              <Typography fontWeight={400} fontSize={"0.8rem"}>
                {requestid}{" "}
                <IconButton
                  aria-label="clipboard"
                  color={"primary"}
                  size="small"
                  onClick={handleCopy}
                >
                  <Iconify fontSize={16} icon="mdi:content-copy" />
                </IconButton>
              </Typography>

            </Grid>

          </Grid>
          {smUp && (
            <Grid item xs={6}>
              <Grid item>
                <Typography>
                  <b>{t("Created")} : </b>
                  {request.createdat.slice(0, 10)}
                </Typography>
              </Grid>

              <Grid item>
                <Typography fontWeight={400} fontSize={"0.8rem"}>
                  {request.surgeryname}
                </Typography>
              </Grid>
            </Grid>
          )}
          {
            !hideViewButton &&
              <Grid>
                <Button
                  variant="text"
                  onClick={handleRoute}
                >
                  {t("View")}
                </Button>
              </Grid>
          }
          {
          user.role === Role.DOCTOR && (
            <Stack justifyContent="end" pb={1} spacing={2} fullWidth>
              <IconButton
                aria-label="delete"
                style={{ position: "absolute", right: "40px" }}
                color={"error"}
                size="small"
                onClick={handleEditClick}
              >
                <Iconify icon="mdi:delete" />
              </IconButton>
            </Stack>
          )}

        </Grid>
      </Box>
    </Card>
      }
    </>
        
      
  );
}

export default RequestComponent;
