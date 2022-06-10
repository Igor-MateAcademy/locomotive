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
    const responce = await api.get('/drivers');

    return responce;
  }

  @action async getFreeDrivers() {
    console.log('get free drivers');
  }

  @action async getBusyDrivers() {
    console.log('get busy drivers');
  }

  @action async createDriver(dto: DriverDTO) {
    const { status } = await api.post('/drivers', { ...dto });

    return status;
  }

  @action async patchDriver(id: string, dto: Partial<DriverDTO>) {
    console.log(id, dto);
  }

  @action async deleteDriver(id: string) {
    console.log(id);
  }
}

export default new DriversStore();
