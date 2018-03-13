export interface Meeting {
  _id: string;
  roomId: string;
  participants: any[];
  appointment: any;
  messages?: any[];
  closedAt?: Date;
}
