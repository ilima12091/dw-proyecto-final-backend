import { User } from "./user";

export interface PostCard extends User{
    PostId: number;
    UserId: number;
    userImage: string;
    userName: string;
    content: string;
    timeStap: Timestamp<number>;
}