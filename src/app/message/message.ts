export interface Message {
  text: string;
  user?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageWebsocketResponse {
  previous: Message;
  current: Message;
}


