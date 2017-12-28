export interface Message {
  _id: string;
  text: string;
  user?: any;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  edited?: boolean;
  appointment?: boolean;
}

export interface MessageWebsocketResponse {
  previous: Message;
  current: Message;
}


