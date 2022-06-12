import { createContext, useContext } from 'react';
import { configure, observable } from 'mobx';

// stores
import driversStore from './DriversStore';
import locomotivesStore from './LocomotivesStore';
import tripsStore from './TripsStore';

configure({ enforceActions: 'observed' });

class RootStore {
  @observable driversStore = driversStore;
  @observable locomotivesStore = locomotivesStore;
  @observable tripsStore = tripsStore;
}

const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

export const useStore = (): RootStore => useContext(StoreContext);

export default new RootStore();
