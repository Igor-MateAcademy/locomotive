import { makeAutoObservable, observable, action } from 'mobx';

// api
import { api } from 'config';

// models
import { DriverDTO } from 'models';

class DriversStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable drivers: DriverDTO[] = [];

  @action async getDrivers() {
    const { data, status } = await api.get('/drivers');

    this.drivers = [...data];

    return { data, status };
  }

  @action async getFreeDrivers() {
    const drivers = await api.get('drivers/free');

    return drivers;
  }

  @action async getBusyDrivers() {
    console.log('get busy drivers');
  }

  @action async createDriver(dto: DriverDTO) {
    const { data, status } = await api.post('/drivers', { ...dto });

    this.drivers.push(data);

    return status;
  }

  @action async patchDriver(id: number, dto: Partial<DriverDTO>) {
    const { data, status } = await api.patch(`/drivers?driver_id=${id}`, { ...dto });

    return status;
  }

  @action async deleteDriver(id: number) {
    const { status } = await api.delete(`/drivers?driver_id=${id}`);

    this.drivers = this.drivers.filter(item => item.id !== id);

    return status;
  }
}

export default new DriversStore();
