import { makeAutoObservable, observable, action } from 'mobx';

// api
import { api } from 'config';

// models
import { TripDTO, CreateTripDTO } from 'models';

class TripsStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable trips: TripDTO[] = [];

  @action async getTripsInTransit() {
    const { data } = await api.get('/trips/intransit');

    return data;  
  }

  @action async getFinishedTrips() {
    const { data } = await api.get('/trips/finished');

    return data;
  }

  @action async createTrip(dto: Partial<CreateTripDTO>) {
    const { data, status } = await api.post(`trips?locomotive_id=${dto.locomotiveId}&driver_id=${dto.driverId}&startDate=${dto.startDate}&endDate=${dto.endDate}`, {
      startFuelLevel: dto.startFuelLevel,
      endFuelLevel: dto.endFuelLevel,
      beginning: dto.beginning,
      destination: dto.destination,
      trainType: dto.trainType,
      exitPoint: dto.exitPoint,
    });

    if (status === 201) {
      this.trips.push(data);
    }

    return status;
  }

  @action async deleteTrip(id: number) {
    const { status } = await api.delete(`/trips?trip_id=${id}`);

    if (status === 200) {
      this.trips = this.trips.filter(trip => trip.id !== id);
    }

    return status;
  }

  @action async patchTrip(id: number, dto: Partial<CreateTripDTO>) {
    const { status } = await api.patch(`trips?trip_id=${id}&locomotive_id=${dto.locomotiveId}&driver_id=${dto.driverId}&startDate=${dto.startDate}&endDate=${dto.endDate}`, {
      startFuelLevel: dto.startFuelLevel,
      endFuelLevel: dto.endFuelLevel,
      beginning: dto.beginning,
      destination: dto.destination,
      trainType: dto.trainType,
      exitPoint: dto.exitPoint,
    });

    return status;
  }
}

export default new TripsStore();
