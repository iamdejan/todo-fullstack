import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { postCreateToDoItem } from "../request/request";
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
