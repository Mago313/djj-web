export interface IUser {
  data: {
    user: { isAdmin: boolean; isDayOff: boolean; name: string; login: string };
  };
}

export enum AppointmentResponse {
  DayOff = 'Day off',
  Exist = 'Date already exists',
}
