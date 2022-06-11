export interface DriverDTO {
  id?: number;
  firstName: string;
  lastName: string;
  driverClass: 'HIGH' | 'MIDDLE' | 'LOW';
}
