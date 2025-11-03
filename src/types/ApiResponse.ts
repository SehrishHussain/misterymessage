import { Message } from './../model/User';


export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}

export interface MessagesResponse extends ApiResponse {
  publicMessages: Message[];
  privateMessages: Message[];
}