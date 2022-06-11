import { createContext, useContext } from 'react';
import { configure, observable } from 'mobx';

// stores
import driversStore from './DriversStore';
import locomotivesStore from './LocomotivesStore';

configure({ enforceActions: 'observed' });

class RootStore {
  @observable driversStore = driversStore;
  @observable locomotivesStore = locomotivesStore;
}

const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

export const useStore = (): RootStore => useContext(StoreContext);

export default new RootStore();
