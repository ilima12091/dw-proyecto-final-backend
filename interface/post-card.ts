import { User } from "./user";

export interface PostCard extends User{
    postId: number;
    userId: number;
    userImage: string;
    userName: string;
    content: string;
    timeStap: Timestamp<number>;
}