import { CheckBox } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  IconButton,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../../utils/axiosSetUp";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const modelStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 650,
  bgcolor: "background.paper",
  border: "0",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

function TodoList(props) {
  const [checked, setChecked] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [todoId, setTodoId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [todoObj, setTodoObj] = useState({});

  const {
    todos,
    setTodos,
    handleOpen,
    handleClose,
    singleTodo,
    setSingleTodo,
    todo,
    setTodoData,
    completedTodos,
    setCompletedTodos,
  } = props;

  const handleOpenDeleteModal = (todo) => {
    console.log(todo);
    setTodoId(todo.todoId);
    localStorage.setItem("todoId", JSON.stringify(todo.todoId));

    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const markTodoComplete = async () => {
    setCompletedTodos(completedTodos.concat(todoObj));
    setTodos(
      todos.filter((element) => {
        return element.todoId !== todoObj.todoId;
      })
    );
    // api for edit todo
    const todoObj1 = {
      todoId: todoObj.todoId,
      title: todoObj.title,
      description: todoObj.description,
      checked: true,
    };
    console.log(todoObj1);
    const response = await axiosInstance
      .put("/updateTodo", todoObj1)
      .catch((error) => {
        toast.error("Some error happened", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      toast.success("Todo Edited successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      fetchAllTodos()
    }
  };
  const fetchAllTodos=async()=>{
    const response = await axiosInstance
        .get("/todoAllList")
        .catch((error) => {
          toast.error("Some error happened", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
  
      if (response) {
        console.log(response?.data);
        setTodos(response?.data.filter((todo)=>{
          return todo.checked==false
        }))
        setCompletedTodos(response?.data.filter((todo)=>{
          return todo.checked==true
        }))
        
      }
  }
  const deleteTodo = async (id) => {
    console.log(id);
    const obj = {
      todoId: id,
    };
    const response = await axiosInstance
      .delete("/deleteTodoById", obj)
      .catch((error) => {
        toast.error("Some error happened", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    if (response) {
      toast.success("Todo Deleted successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      fetchAllTodos()
    }
  };
  return (
    <>
      <div
        style={{
          alignItems: "start",
          flexDirection: "column",

          maxHeight: "100%",
          padding: "10px",
          margin: "5px",

          // justifyContent: "start",
        }}
      >
        <Paper elevation={4} sx={{paddingTop:1}}>
          <Typography variant={"h5"} display={"flex"} justifyContent={"center"}>
            Pending Todos
          </Typography>
          {todos.length > 0 ? (
            todos.map((todo) => {
              return (
               
                  <div
                  key={todo.todoId}
                    style={{
                      padding: "10px",
                      maxWidth: "100%",
                      margin: "0px 10px 0px 10px",
                    }}
                  >
                    <Paper elevation={2} sx={{ padding: "10px" }} >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        
                      >
                        <Checkbox
                          checked={todo.checked}
                          onChange={() => {
                            setTodoObj(todo);
                            handleOpenModal();
                            // markTodoComplete(todo);
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                        <span>{todo?.title}</span>
                        <div>
                          <Button
                            onClick={() => {
                              setSingleTodo(todo);
                              handleOpen();
                            }}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            color="error"
                            onClick={() => {
                              handleOpenDeleteModal(todo);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </div>
                      </div>
                    </Paper>
                  </div>
                  // <br />
                
              );
            })
          ) : (
            <div
              style={{
                padding: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              NO pending todos
            </div>
          )}
        </Paper>
      </div>
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDeleteModal}>
          <Box sx={modelStyle}>
            <IconButton
              sx={{ float: "right", padding: "0" }}
              onClick={handleCloseDeleteModal}
            >
              <CloseIcon />
            </IconButton>
            <Box component="h3" sx={{ margin: "0 0 20px 0" }}>
              Please Confirm
            </Box>
            <p>Are you sure you want to delete?</p>
            <Box sx={{ display: "flex", marginTop: "30px" }}>
              <Button
                sx={{ width: "40%" }}
                variant="contained"
                color="error"
                onClick={async () => {
                  console.log(todoId);
                  handleCloseDeleteModal();
                  deleteTodo(todoId);
                }}
              >
                Delete
              </Button>
              <Button
                sx={{ width: "40%", marginLeft: "auto" }}
                variant="contained"
                color="primary"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={openModal}
        onClose={handleCloseDeleteModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={modelStyle}>
            <IconButton
              sx={{ float: "right", padding: "0" }}
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </IconButton>
            <Box component="h3" sx={{ margin: "0 0 20px 0" }}>
              Please Confirm
            </Box>
            <p>Are you sure you want to move this pending todo to completed?</p>
            <Box sx={{ display: "flex", marginTop: "30px" }}>
              <Button
                sx={{ width: "40%" }}
                variant="contained"
                color="error"
                onClick={async () => {
                  markTodoComplete();
                  handleCloseModal();
                }}
              >
                Yes
              </Button>
              <Button
                sx={{ width: "40%", marginLeft: "auto" }}
                variant="contained"
                color="primary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default TodoList;
