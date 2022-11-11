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
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosSetUp";
import { useRouter } from "next/router";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";

const theme = createTheme();

const schema = yup
  .object({
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
  })
  .required();

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
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
      email: data.email,
      psw: data.password,
    };
    const response = await axiosInstance
      .post("/login", postData)
      .catch((error) => {
        toast.error("Invalid credentials", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      toast.success("User logged in successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      localStorage.setItem(
        "accessToken",
        JSON.stringify(response?.data?.access_token)
      );
      const { userId, userName, email } = response?.data;
      const userObj = {
        userId,
        userName,
        email,
      };
      localStorage.setItem("userObj", JSON.stringify(userObj));
      router.push("/dashboard");
    }
  };

  return (
    // <ThemeProvider theme={theme}>
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
          Sign In
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
                required
                fullWidth
                id="email"
                {...register("email")}
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              <small style={{ color: "red" }}>{errors.email?.message}</small>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                {...register("password")}
                label="Password"
                type={showPass ? "text" : "password"}
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
                          <VisibilityOffIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <small style={{ color: "red" }}>{errors.password?.message}</small>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/sign-up")}
                variant="body2"
              >
                Dont have an account? Register Here
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    // </ThemeProvider>
  );
}
