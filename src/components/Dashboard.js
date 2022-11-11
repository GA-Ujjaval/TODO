import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { UploadFile } from "@mui/icons-material";
import axiosInstance from "../../utils/axiosSetUp";
import TodoList from "./TodoList";
import EditTodo from "./EditTodos";
import uuid from "react-uuid";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import CompletedTodoList from "./CompletedTodoList";
import Loader from "./Loader";
import Image from "next/image";

function Dashboard() {
  // for image
  const [openLoader, setLoader] =useState(false);
  const closeLoader = () => {
    setLoader(false);
  };
  const handleLoader = () => {
    setLoader(true);
  };

  // for modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {

    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [img, setImg] = useState(null);
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [imgUrl, setImgUrl] = useState(null);

  const [todoImg,setTodoImg]=useState([])

  const [images, setImages] = useState([]);
  const [singleTodo, setSingleTodo] = useState({});
  const [todo, setTodoData] = useState({
    id: "",
    title: "",
    description: "",
    image: [],
    checked: false,
  });

  //   api call for upload image
  const uploadFile = async (fileName) => {
    console.log(fileName);
    const data1 = new FormData();
    data1.append("file", fileName);
    handleLoader()
    const response = await axiosInstance.post(
      "/img",
      data1
    );

    if (response) {
      console.log(response?.data);
      setImgUrl(response?.data);
      closeLoader()
    }
  };

  const handleFile = (e) => {
    console.log("file object is", e.target.files[0]);
    setTodoData({
      ...todo,
      image: todo.image.concat(URL.createObjectURL(e.target.files[0])),
    });
    setImg(URL.createObjectURL(e.target.files[0]));
    setImages([...images, URL.createObjectURL(e.target.files[0])]);
    uploadFile(e.target.files[0]);
  };

  const addTodo = (e) => {
    e.preventDefault();
    console.log(todo);
    setTodos([...todos, todo]);
    const user = JSON.parse(localStorage.getItem("userObj"));
    if(imgUrl){
      const todoObj = {
        userId: user.userId,
        title: todo.title,
        description: todo.description,
        checked: false,
        url:imgUrl.url,
        public_id:imgUrl.public_id
      };
      saveTodos(todoObj);
      console.log(todoObj);

    }
    else{
      const todoObj = {
        userId: user.userId,
        title: todo.title,
        description: todo.description,
        checked: false,
        url:"",
        public_id:""
        
      };
      saveTodos(todoObj);
      console.log(todoObj);
    }

    setTodoData({ ...todo, title: "", description: "", image: [] });
    setImages([]);
  };
  const removeTodo = () => {
    setTodos([]);
  };
  const getAllImg=async(id,obj)=>{
    const imgObj={
      userId:obj.userId,
      todoId:id
    }
    const response1 = await axiosInstance
    .get("/getImg", imgObj)
    .catch((error) => {
      toast.error("Some error happened", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    });

  if (response1) {
    setTodoImg(response1?.data)
  }

  }
  const insertImage = async (id, obj) => {
    const imgData = {
      userId: obj.userId,
      todoId: id,
      imgList: imgUrl,
    };
    console.log(imgData);
    const response1 = await axiosInstance
      .post("/insertTodoImg", imgData)
      .catch((error) => {
        toast.error("Some error happened", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response1) {
      toast.success("Todo created successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      getAllImg(id,obj)
      //
    }
  };
  const saveTodos = async (obj) => {
    // api call for save

    const response = await axiosInstance
      .post("/insertTodoData", obj)
      .catch((error) => {
        toast.error("Some error happened", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      fetchAllTodos()
      const { todoId } = response?.data;
    //  if (images.length>0) {
      
    //    insertImage(todoId, obj);
    //  }
    }
    setImg(null);
    setImgUrl(null)

    // api for image insert
  };

  const removeImage = async (img) => {
    setImg(null)
    setImgUrl(null)
    const obj = {
      public_id: img?.public_id,
    };
    // handleLoader()
    const response = await axiosInstance
      .post("/imgRemove", obj)
      .catch((error) => {
        toast.error("Some error happened", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      // closeLoader()
    }
    // setTodoData({
    //   ...todo,
    //   image: todo.image.filter((image) => {
    //     return image !== img;
    //   }),
    // });
    // setImgUrl(
    //   imgUrl.filter((image) => {
    //     return image.public_id !== img.public_id;
    //   })
    // );
  };
  const fetchAllTodos = async () => {
    const response = await axiosInstance.get("/todoAllList").catch((error) => {
      toast.error("Some error happened", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    });

    if (response) {
      console.log(response?.data);
      setTodos(
        response?.data.filter((todo) => {
          return todo.checked == false;
        })
      );
      setCompletedTodos(
        response?.data.filter((todo) => {
          return todo.checked == true;
        })
      );
    }
  };
  useEffect(() => {
    fetchAllTodos();
  }, []);

  return (
    <>
      {/* <Typography
        display="flex"
        justifyContent="center"
        alignItems="center"
        variant="h4"
        component="h4"
      >
        ToDo App
      </Typography> */}
      <Container component="main" maxWidth="lg" sx={{ display: "flex" }}>
      <Loader
            openLoader={openLoader}
            setLoader={setLoader}
            handleLoader={handleLoader}
            closeLoader={closeLoader}
          />
        <Box
          component={"form"}
          onSubmit={addTodo}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="title"
                value={todo.title}
                onChange={(e) =>
                  setTodoData({
                    ...todo,
                    title: e.target.value,
                    todoId: uuid(),
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={todo.description}
                multiline
                rows={4}
                onChange={(e) =>
                  setTodoData({ ...todo, description: e.target.value })
                }
              />
            </Grid>

            <Button type="submit" variant="outlined" sx={{ margin: "20px" }}>
              Add Todo
            </Button>
          </Grid>
        </Box>
        <Box
          sx={{
            marginTop: 8,
            // border: "1px solid black",
            maxWidth: "100%",
            height: "200px",
            marginTop: 8,
            marginLeft: 4,
          }}
        >
          <Paper sx={{ height: "200px" }} elevation={2}>
            {/* {images.length === 3 ? null : ( */}
              {img==null&&<Button variant="contained" component="label" sx={{ margin: 1 }}>
                Upload Image
                <input type="file" hidden onChange={handleFile} />
              </Button>}
            {/* )} */}
            {img && (
              <>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {/* {imgUrl.map((img) => {
                    return ( */}
                     
                        <div  style={{ margin: "10px" }}>
                          <Image src={img} alt="img" height={140} width={140} />
                          <div
                            style={{
                              position: "relative",
                              left: 140,
                              top: -180,
                            }}
                          >
                            <IconButton onClick={() => removeImage(imgUrl)}>
                              {" "}
                              <CloseIcon />
                            </IconButton>
                          </div>
                        </div>
                      
                    {/* );
                  })} */}
                </div>
              </>
            )}
          </Paper>
        </Box>
      </Container>
      {/* {images.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
          {images.map((img) => {
              return (
                <>
                  <div style={{ margin: "10px" }}>
                    <img src={img} alt="img" width={150} />
                    <div
                      style={{
                        position: "relative",
                        left: 130,
                        top: -105,
                      }}
                    >
                      <IconButton>
                        {" "}
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <small>Max 3 images</small>
          </div>
        </>
      )} */}
      <div>
        <Grid container>
          <Grid item xs={6}>
            <TodoList
              todos={todos}
              setTodos={setTodos}
              handleOpen={handleOpen}
              handleClose={handleClose}
              singleTodo={singleTodo}
              setSingleTodo={setSingleTodo}
              todo={todo}
              setTodoData={setTodoData}
              completedTodos={completedTodos}
              setCompletedTodos={setCompletedTodos}
            />
          </Grid>
          <Grid item xs={6}>
            <CompletedTodoList
              completedTodos={completedTodos}
              setCompletedTodos={setCompletedTodos}
              handleOpen={handleOpen}
              handleClose={handleClose}
              singleTodo={singleTodo}
              setSingleTodo={setSingleTodo}
              todo={todo}
              setTodoData={setTodoData}
              todos={todos}
              setTodos={setTodos}
            />
          </Grid>
        </Grid>
      </div>
      <EditTodo
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        singleTodo={singleTodo}
        setSingleTodo={setSingleTodo}
        todo={todo}
        setTodoData={setTodoData}
        todos={todos}
        setTodos={setTodos}
        todoImg={todoImg}
        setTodoImg={setTodoImg}
        fetchAllTodos={fetchAllTodos}
      />
      {/* {todos.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={saveTodos}>
            Save
          </Button>
          <Button variant="outlined" onClick={removeTodo}>
            Cancel
          </Button>
        </div>
      )} */}
    </>
  );
}

export default Dashboard;
