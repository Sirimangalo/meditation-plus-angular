export interface Appointment {
  _id: string;
  user?: any;
  hour: number;
  weekDay: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppointmentCall {
  _id: string;
  user?: any;
  teacher?: any;
  appointment: Appointment;
  startedAt?: Date;
  endedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
