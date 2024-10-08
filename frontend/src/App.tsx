import { zodResolver } from "@hookform/resolvers/zod";
import { AppBar, Box, Button, Checkbox, Container, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { Fragment, JSX, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToDoItem, ToDoItemSchema } from "./schema/ToDoItemSchema";
import { usePaginateToDoList } from "./hooks/query";
import { useInView } from "react-intersection-observer";
import { useCreateToDoItem, useDeleteToDoItem, useUpdateToDoItem } from "./hooks/mutation";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function App(): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm<ToDoItem>({
    resolver: zodResolver(ToDoItemSchema),
    mode: "all",
  });

  const createToDoItemMutation = useCreateToDoItem();
  const paginateToDoListQuery = usePaginateToDoList();
  const updateToDoItemMutation = useUpdateToDoItem();
  const deleteToDoItemMutation = useDeleteToDoItem();
  const {ref, inView} = useInView();

  useEffect(() => {
    if(inView) {
      void paginateToDoListQuery.fetchNextPage();
    }
  }, [inView, paginateToDoListQuery]);

  function onSubmit(data: ToDoItem): void {
    createToDoItemMutation.mutate(data);
  }

  function handleUpdatedCheckbox(event: React.ChangeEvent<HTMLInputElement>, data: ToDoItem): void {
    const checked: boolean = event.target.checked;
    if(data.id) {
      updateToDoItemMutation.mutate({...data, finished: checked});
    }
  }

  function handleDeleteToDoButton(data: ToDoItem): void {
    deleteToDoItemMutation.mutate(data);
  }

  return (
    <>
      <AppBar position="static" sx={{margin:"0", padding:"0"}}>
        <Toolbar>
          <Typography variant="h5">
            To-do Fullstack
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          backgroundColor: "rgba(230,230,230,1)",
          background: "linear-gradient(180deg, rgba(230,230,230,1) 0%, rgba(234,255,234,1) 100%)",
          minHeight: "100vh",
          minWidth: "100%",
          margin: "0",
          paddingBottom: "5rem",
        }}
      >
        {/* recommended approach without editing `eslint.config.js`
        ref: https://github.com/orgs/react-hook-form/discussions/8622#discussioncomment-6305393 */}
        <form style={{paddingTop: 2}} onSubmit={(event: React.FormEvent<HTMLElement>) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}>
          <Stack
            gap={4}
            marginTop={3}
            marginX="auto"
            padding={2}
            maxWidth="40%"
            elevation={2}
            component={Paper}
          >
            <Typography variant="h6" align="center">
              Form
            </Typography>
            <TextField
              {...register("title")}
              label="Title"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              {...register("description", {
                required: false,
                setValueAs: (value: string | undefined) => value || undefined
              })} 
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <Button type="submit" variant="contained">Add</Button>
          </Stack>
        </form>

        <Typography variant="h6" align="center" marginTop={3}>
          To-do List
        </Typography>
        <Stack gap={2} marginBottom={2}>
          {paginateToDoListQuery.isSuccess && paginateToDoListQuery.data.pages.map((page, index) => (
            <Fragment key={index}>
              {page.map((item) => (
                <Paper
                  sx={{
                    padding: 1,
                  }}
                  key={item.id}
                >
                  <Stack direction="row">
                    <Box flexGrow={1} paddingLeft={1}>
                      <Typography variant="h6">{item.title}</Typography>
                      <span>Description: {item.description ?? "-"}</span>
                    </Box>
                    <Box paddingRight={2} marginRight={2} alignContent="center">
                      <Checkbox checked={item.finished} onChange={(e) => handleUpdatedCheckbox(e, item)} />
                      <span>Finished?</span>
                    </Box>
                    <IconButton onClick={() => handleDeleteToDoButton(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Fragment>
          ))}
        </Stack>
        <Box ref={ref} id="observer-trigger" marginTop={2} padding={2}>
        </Box>
      </Container>
    </>
  );
}
