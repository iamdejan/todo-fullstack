import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { deleteToDoItem, postCreateToDoItem, putUpdateToDoItem } from "../request/request";
import { ToDoItem } from "../schema/ToDoItemSchema";

export function useCreateToDoItem(): UseMutationResult<void, Error, ToDoItem> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ToDoItem) => postCreateToDoItem(data),
    onError: (error: Error) => {
      console.log(error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["todos"]
      });
    }
  });
}

export function useUpdateToDoItem(): UseMutationResult<void, Error, ToDoItem> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ToDoItem) => putUpdateToDoItem(data),
    onError: (error: Error) => {
      console.log(error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["todos"]
      });
    }
  });
}

export function useDeleteToDoItem(): UseMutationResult<void, Error, ToDoItem> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ToDoItem) => deleteToDoItem(data),
    onError: (error: Error) => {
      console.log(error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["todos"]
      });
    }
  });
}
