import { User } from "./user";

export interface Post extends User{
    postId?: string;
    title: string;
    content: string;
}