import axios from "axios";
import { ToDoItem } from "../schema/ToDoItemSchema";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8443"
});

const perPageLimit = 4;

export async function postCreateToDoItem(item: ToDoItem): Promise<void> {
  await axiosInstance.post(`/todos`, item);
}

export async function paginateToDoList({pageParam}: {pageParam: string}): Promise<ToDoItem[]> {
  return (await axiosInstance<ToDoItem[]>(`/todos?last_id=${pageParam}&limit=${perPageLimit}`)).data;
}
