import axios from "axios";
import { ToDoItem } from "../schema/ToDoItemSchema";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL as string | undefined
});

const perPageLimit = 4;

export async function postCreateToDoItem(item: ToDoItem): Promise<void> {
  await axiosInstance.post("/todos", item);
}

export async function paginateToDoList({pageParam}: {pageParam: string}): Promise<ToDoItem[]> {
  return (await axiosInstance<ToDoItem[]>(`/todos?last_id=${pageParam}&limit=${perPageLimit.toString()}`)).data;
}

export async function putUpdateToDoItem(item: ToDoItem): Promise<void> {
  await axiosInstance.put(`/todos/${item.id ?? ""}`, item);
}

export async function deleteToDoItem(item: ToDoItem): Promise<void> {
  await axiosInstance.delete(`/todos/${item.id ?? ""}`);
}
