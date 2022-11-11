import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Container, Grid, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../../utils/axiosSetUp";
import Loader from "./Loader";
import Image from "next/image";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EditTodo(props) {
  const {
    open,
    setOpen,
    handleOpen,
    handleClose,
    singleTodo,
    setSingleTodo,
    todo,
    setTodoData,
    todos,
    setTodos,
    todoImg,
    setTodoImg,
    fetchAllTodos,
  } = props;

  const [img, setImg] = useState(null);
  const [openLoader, setLoader] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const closeLoader = () => {
    setLoader(false);
  };
  const handleLoader = () => {
    setLoader(true);
  };

  const [todoToEdit, setTodoToEdit] = useState({
    title: singleTodo.title,
    description: singleTodo.description,
    image: singleTodo.image,
  });
  useEffect(() => {
    setTodoToEdit({
      ...todoToEdit,
      title: singleTodo.title,
      description: singleTodo.description,
      url: singleTodo.url,
      public_id: singleTodo.public_id,
    });
    console.log(singleTodo);
  }, [singleTodo]);

  const updateImg = async (todoId, userId) => {
    const imgObj = {
      userId,
      todoId,
      imgList: imgUrl,
    };

    const response = await axiosInstance
      .put("/updateImg", imgObj)
      .catch((error) => {
        toast.error("Some error happened", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      toast.success("Todo Updated successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      fetchAllTodos();
      closeLoader();
    }
  };
  const updateTodo = async (todoObj) => {
    const response = await axiosInstance
      .put("/updateTodo", todoObj)
      .catch((error) => {
        toast.error("Some error happened", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      handleClose();
      const { todoId, userId } = response?.data;

      fetchAllTodos();
      setImg(null);
      setImgUrl(null);
      // setTodoToEdit({...todoToEdit,url:'',public_id:''})
      closeLoader();
    }
  };
  const saveItems = async () => {
    // setTodos(
    //   todos.map((todo) => {
    //     if (todo.id == singleTodo.id) {
    //       return { ...todo, item: todoToEdit.item, image: todoToEdit.image };
    //     } else {
    //       return todo;
    //     }
    //   })
    // );

    if (todoToEdit.url) {
      const todoObj = {
        todoId: singleTodo.todoId,
        title: todoToEdit.title,
        description: todoToEdit.description,
        url: todoToEdit?.url,
        public_id: todoToEdit?.public_id,
      };
      updateTodo(todoObj);
    } else {
      const todoObj = {
        todoId: singleTodo.todoId,
        title: todoToEdit.title,
        description: todoToEdit.description,
        url: "",
        public_id: "",
      };
      updateTodo(todoObj);
    }

    handleLoader();
  };

  const handleFile = async (e) => {
    // setTodoToEdit({
    //   ...todoToEdit,
    //   image: todoToEdit.image.concat(URL.createObjectURL(e.target.files[0])),
    // });
    setImg(URL.createObjectURL(e.target.files[0]));
    const data1 = new FormData();
    data1.append("file", e.target.files[0]);
    handleLoader();
    const response = await axiosInstance.post(
      "/img",
      data1
    );

    if (response) {
      console.log(response?.data);
      setImgUrl(response?.data);
      setTodoToEdit({...todoToEdit,url:response?.data?.url,public_id:response?.data?.public_id})
      closeLoader();
    }
  };
  const removeImage = async (img) => {
    
    setImg(null);
    setImgUrl(null);
    const obj = {
      public_id: img?.public_id,
    };
    // handleLoader();
    const response = await axiosInstance
      .post("/imgRemove", obj)
      .catch((error) => {
        toast.error("Some error happened", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      setTodoToEdit({
        ...todoToEdit,
        url: "",
        public_id: "",
      });
      // closeLoader();
    }
    // setTodoImg(
    //   todoImg.filter((image) => {
    //     return image.public_id !== img.public_id;
    //   })
    // );
    // setTodoToEdit({
    //   ...todoToEdit,
    //   image: todoToEdit.image.filter((image) => {
    //     return image !== img;
    //   }),
    // });
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Loader
            openLoader={openLoader}
            setLoader={setLoader}
            handleLoader={handleLoader}
            closeLoader={closeLoader}
          />
          <Typography variant="h5">Edit Todo</Typography>
          <Container component="main" maxWidth="lg" sx={{ display: "flex" }}>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="title"
                    value={todoToEdit.title}
                    onChange={(e) => {
                      setTodoToEdit({ ...todoToEdit, title: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={todoToEdit.description}
                    multiline
                    rows={4}
                    onChange={(e) =>
                      setTodoToEdit({
                        ...todoToEdit,
                        description: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Container>
          {todoToEdit.url == "" && (
            <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
              Upload New Image
              <input type="file" hidden onChange={handleFile} />
            </Button>
          )}
          <br />

          <div style={{ display: "flex" }}>
            {/* {todoImg?.map((img) => {
              return ( */}
            
            {todoToEdit.url !== "" && (
              <div style={{ margin: "5px" }}>
                <Image
                  src={todoToEdit?.url}
                  alt="img"
                  height={100}
                  width={100}
                />
                <div
                  style={{
                    position: "relative",
                    left: 105,
                    top: -120,
                  }}
                >
                  <IconButton onClick={() => removeImage(todoToEdit)}>
                    {" "}
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            )}
            {/* );
            })} */}
          </div>
          <Button sx={{ marginTop: 2 }} variant="contained" onClick={saveItems}>
            Save
          </Button>
          <Button
            sx={{ marginTop: 2, marginLeft: 2 }}
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>

          {/* <TextField
            size="small"
            value={todoToEdit.item}
            onChange={(e) => {
              setTodoToEdit({ ...todoToEdit, item: e.target.value });
            }}
          /> */}
        </Box>
      </Modal>
    </div>
  );
}
