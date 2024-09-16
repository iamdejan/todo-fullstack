import { InfiniteData, keepPreviousData, useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import { paginateToDoList } from "../request/request";
import { ToDoItem } from "../schema/ToDoItemSchema";
import { zeroULID } from "../const/const";

export function usePaginateToDoList(): UseInfiniteQueryResult<InfiniteData<ToDoItem[]>> {
  return useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: paginateToDoList,
    initialPageParam: zeroULID,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => {
      if(lastPage.length < 1) {
        return undefined;
      }

      return lastPage.at(-1)?.id;
    }
  });
}
