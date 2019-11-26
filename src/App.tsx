import React, {useState} from 'react';

import SearchData from './types';
import SearchForm from './Search';
import DisplayList from './Display';

const App: React.FC = () => {
  const [victimList, setVictimList] = useState([]);
  const [isDataReady, setIsDataReady] = useState(true);

  const getDetails = async (data: SearchData) => {
    setIsDataReady(false);
    const response = await fetch(
      `http://localhost:8080/find/victim/byName/${data.name}`,
    );

    if (response.ok) {
      const result = await response.json();
      setVictimList(result.map.victims.list);
      setIsDataReady(true);
    } else if (response.status === 404) {
      setIsDataReady(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <SearchForm onFormSubmit={getDetails}></SearchForm>
      <DisplayList isReady={isDataReady} dataArray={victimList}></DisplayList>
    </div>
  );
};

export default App;
