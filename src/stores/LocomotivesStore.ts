import { makeAutoObservable, observable, action } from 'mobx';

// api
import { api } from 'config';

// models
import { LocomotiveDTO } from 'models'

class LocomotivesStore {
  constructor() {
    makeAutoObservable(this);
  };

  @observable locomotives: LocomotiveDTO[] = [];

  @action async getBusyLocomotives () {
    const busy = await api.get('/locomotives/busy');

    return busy;
  }

  @action async getFreeLocomotives () {
    const free = await api.get('/locomotives/free');

    return free;
  }

  @action async createLocomotive (dto: Partial<LocomotiveDTO>) {
    const { data, status } = await api.post('locomotives', dto);

    this.locomotives.push(data);

    return status;
  }

  @action async patchLocomotive (id: number, dto: Partial<LocomotiveDTO>) {
    const { status } = await api.patch(`locomotives?locomotive_id=${id}`, dto);

    if (status === 200) {
      this.locomotives = this.locomotives.filter(l => l.id !== id);
    }

    return status;
  }

  @action async deleteLocomotive (id: number) {
    const { data, status } = await api.delete(`locomotives?locomotive_id=${id}`);

    if (status === 200) {
      this.locomotives = this.locomotives.filter(l => l.id !== id);
    }

    return status;
  }

  @action async getLocomotivesByDriver (id: number) {
    const { data } = await api.get(`locomotives/driver?driver_id=${id}`);

    return data;
  }
}

export default new LocomotivesStore();