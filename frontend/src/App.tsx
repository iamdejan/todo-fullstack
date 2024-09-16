import { zodResolver } from "@hookform/resolvers/zod";
import { AppBar, Button, Checkbox, Container, FormGroup, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { Fragment, JSX } from "react";
import { useForm } from "react-hook-form";
import { ToDoItem, ToDoItemSchema } from "./schema/ToDoItemSchema";
import { useCreateToDoItem, usePaginateToDoList } from "./hooks/todo";

export default function App(): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm<ToDoItem>({
    resolver: zodResolver(ToDoItemSchema),
    mode: "all",
  });

  const createToDoItemMutation = useCreateToDoItem();
  const paginateToDoList = usePaginateToDoList();

  function onSubmit(data: ToDoItem): void {
    createToDoItemMutation.mutate(data);
  }

  function onCheckChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    const checked = event.target.checked;
    const index = Number.parseInt(event.target.name);

    // TODO dejan: update db
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
              {...register("description")} 
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
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 3,
            maxHeight: "60vh",
            maxWidth: "70vw",
            marginX: "auto",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="22%">Title</TableCell>
                <TableCell width="70%">Description</TableCell>
                <TableCell width="8%">Is completed?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginateToDoList.isSuccess && paginateToDoList.data?.pages?.map((page, index) => (
                <Fragment key={index}>
                  {page.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell><Checkbox name={index.toString()} checked={item.finished} onChange={onCheckChanged} /></TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
