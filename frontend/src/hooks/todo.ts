import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { paginateToDoList, postCreateToDoItem } from "../request/request";
import { ToDoItem } from "../schema/ToDoItemSchema";

export function useCreateToDoItem(): UseMutationResult<void, Error, ToDoItem> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ToDoItem) => postCreateToDoItem(data),
    onError: (error: Error) => {
      console.log(error);
    },
    onSettled: (_, __, ___) => {
      queryClient.invalidateQueries({
        queryKey: ["todos"]
      });
    }
  });
}

export function usePaginateToDoList(): UseInfiniteQueryResult<InfiniteData<ToDoItem[]>> {
  return useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: paginateToDoList,
    initialPageParam: "00000000000000000000000000",
    getNextPageParam: (lastPage, __, ___) => {
      if(lastPage.length < 1) {
        return undefined;
      }

      return lastPage.at(-1)?.id;
    }
  });
}
