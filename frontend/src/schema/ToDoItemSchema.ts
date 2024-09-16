import {z} from "zod";

export const ToDoItemSchema = z.object({
  id: z.string().ulid().optional(),
  title: z.string().min(1).max(25),
  description: z.string().max(50).optional(),
  finished: z.boolean().default(false),
});

export type ToDoItem = z.infer<typeof ToDoItemSchema>;
