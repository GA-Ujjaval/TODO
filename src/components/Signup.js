import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axiosInstance from "../../utils/axiosSetUp";
import { useRouter } from "next/router";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";

const theme = createTheme();
const schema = yup
  .object({
    name: yup.string().required("name is required"),

    email: yup
      .string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password is required"),
  })
  .required();

export default function Signup() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    console.log(data);
    const postData = {
      userName: data.name,
      email: data.email,
      psw: data.password,
      cnfpsw: data.confirmPassword,
    };
    const response = await axiosInstance
      .post("/signup", postData)
      .catch((error) => {
        toast.error(error.message ? error.message : "user already exists", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      toast.success("User signedup successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      router.push("/login");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  {...register("name")}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                />
                <small style={{ color: "red" }}>{errors.name?.message}</small>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  {...register("email")}
                  autoComplete="email"
                />
                <small style={{ color: "red" }}>{errors.email?.message}</small>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  {...register("password")}
                  label="Password"
                  type={showPass?'text':'password'}
                  id="password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {!showPass ? (
                          <IconButton onClick={() => setShowPass(!showPass)}>
                            <VisibilityIcon />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => setShowPass(!showPass)}>
                            < VisibilityOffIcon />
                          </IconButton>
                        )}
                        
                      </InputAdornment>
                    ),
                  }}
                />
                <small style={{ color: "red" }}>
                  {errors.password?.message}
                </small>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  {...register("confirmPassword")}
                  label="Confirm Password"
                  type='password'
                  id="cPassword"
                  autoComplete="new-password"
                  
                />
                <small style={{ color: "red" }}>
                  {errors.confirmPassword?.message}
                </small>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push("/login")}
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
