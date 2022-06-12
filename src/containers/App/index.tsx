import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

// containers
import { Layout, Board, DriversList, LocomotivesList, TripsList } from 'containers';

// stores
import store, { useStore } from 'stores';

// styles
import 'antd/dist/antd.css';
import 'sources/styles/styles.scss';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider {...store}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="board" element={<Board />} />
            <Route path="drivers" element={<DriversList />} />
            <Route path="locomotives" element={<LocomotivesList />} />
            <Route path="trips" element={<TripsList />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
