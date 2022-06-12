import moment from 'moment';
import { DriverDTO, LocomotiveDTO } from 'models';

export interface TripDTO {
  id: number;
  beginning: string;
  destination: string;
  driver: DriverDTO;
  locomotive: LocomotiveDTO;
  startDate: moment.Moment | string;
  endDate: moment.Moment | string;
  startFuelLevel: number;
  endFuelLevel: number;
  exitPoint: string;
  trainType: Train;
}

export type Train = 'LONG' | 'SHORT' | 'CHILD';

export interface CreateTripDTO {
  locomotiveId: number;
  driverId: number;
  startDate: moment.Moment | string;
  endDate: moment.Moment | string;
  startFuelLevel: number;
  endFuelLevel: number;
  beginning: string;
  destination: string;
  trainType: Train;
  exitPoint: string;
}
