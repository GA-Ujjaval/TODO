import { Button, Grid, TextField } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

function Page() {
  return (
    <>
      <Container component="main" maxWidth="sm" sx={{ display: "flex" }}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <TextField
                fullWidth
                label="title"
                onChange={(e) =>
                  setTodoData({ ...todo, title: e.target.value, id: uuid() })
                }
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                onChange={(e) =>
                  setTodoData({ ...todo, description: e.target.value })
                }
              />
            </Grid>

            <Button variant="outlined" sx={{ marginLeft: "20px" }}>
              Add Todo
            </Button>
          </Grid>
        </Box>

        <Box
          sx={{
            marginTop: 8,
            border: "1px solid black",
            maxWidth: "100%",
            height: "200px",
            marginTop: 8,
            marginLeft: 4,
          }}
        >
          <Button variant="contained" sx={{ margin: 1 }}>
            Upload Image
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Page;
