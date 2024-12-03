import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
  Avatar,
  Button,
  CircularProgress,
  Link,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import LocationCityIcon from "@mui/icons-material/LocationCity";
import { useLoginForm } from "./useLoginForm";
import RenderForm from "../../../Resuable/RenderForm";
import { useSelector } from "react-redux";

const fields = [
  { label: "Email", name: "email", type: "email", col: 12, required: true },
  {
    label: "Password",
    name: "password",
    type: "password",
    col: 12,
    required: true,
  },
];

const LoginPage = () => {
  const { formik } = useLoginForm();
  const loading = useSelector((state) => state.auth.loading);

  const paperStyle = {
    height: "auto",
    padding: 20,
    margin: "20px auto",

    width: 400,
    backgroundColor: "#E6F4F1",
    borderRadius: "12px",
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
  };
  const avatarStyle = { backgroundColor: "#D9D9D9" };
  const btnstyle = { backgroundColor: "#1B6DA1", margin: "12px 0" };
  const logoStyle = {
    backgroundColor: "#D9D9D9",
    margin: "10px 0",
    width: 70,
    height: 70,
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh", backgroundColor: "#F5F5F5" }}
    >
      <Grid item>
        <Grid align="center">
          <Avatar style={logoStyle}>
            <LocationCityIcon
              style={{ color: "#002A57", width: 56, height: 56 }}
            />
          </Avatar>
          <h2>mBank Technology</h2>
        </Grid>

        <Paper elevation={12} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon style={{ color: "#002A57" }} />
            </Avatar>
            <h2>Login</h2>
          </Grid>
          <RenderForm fields={fields} formik={formik} />
          <Grid container justifyContent="center">
            <Button
              style={btnstyle}
              color="primary"
              variant="contained"
              onClick={() => formik.submitForm()}
              disabled={Boolean(loading)}
              fullWidth
            >
              {loading ? (
                <div>
                  <CircularProgress color="inherit" size={16} sx={{ mr: 1 }} />
                  Loading...
                </div>
              ) : (
                "Login"
              )}
            </Button>
            {/* <Typography align="center" style={{ marginTop: "10px" }}>
              <Link href="#">Forgot Password?</Link>
            </Typography>
            <Typography align="center" style={{ marginTop: "10px" }}>
              Don't have an account?
              <Link href="#">Sign Up Here.</Link>
            </Typography> */}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
