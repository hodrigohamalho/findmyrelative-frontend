import React, {useState} from 'react';

import '@patternfly/react-core/dist/styles/base.css';
import {Page, PageHeader} from '@patternfly/react-core';

import SearchData from './types';
import SearchForm from './Search';
import DisplayList from './Display';

const logoProps = {
  href: 'https://erdemo.io',
  target: '_blank',
};

const Header = (
  <PageHeader
    logo="Find My Relative"
    logoProps={logoProps}
    toolbar="Toolbar"
    avatar=" | Avatar"
  />
);

const App: React.FC = () => {
  const [victimList, setVictimList] = useState([]);
  const [isDataReady, setIsDataReady] = useState(true);

  const fetchDetails = async (data: SearchData) => {
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
    <Page header={Header}>
      <SearchForm onFormSubmit={fetchDetails}></SearchForm>
      <DisplayList isReady={isDataReady} dataArray={victimList}></DisplayList>
    </Page>
  );
};

export default App;
