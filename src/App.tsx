import React, { useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import { Page, PageHeader } from "@patternfly/react-core";

import SearchData from "./types";
import SearchForm from "./Search";
import DisplayList from "./Display";
import { getVictimData } from "./mock/mockSearchData";

const logoProps = {
  href: "https://erdemo.io",
  target: "_blank"
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
  const [victimList, setVictimList] = useState();
  const [isDataReady, setIsDataReady] = useState(true);
  const [isResponseOk, setIsResponseOk] = useState();

  const fetchDetails = async (data: SearchData) => {
    setIsDataReady(false);
    if (process.env.REACT_APP_MOCK_API) {
      const mockResponse = getVictimData(data.name);
      setIsDataReady(true);
      setVictimList(mockResponse.map.victims.list);
      setIsResponseOk(true);
    } else {
      fetch(
        process.env.REACT_APP_BACKEND_URL + `/find/victim/byName/${data.name}`
      )
        .then(response => {
          if (response.ok) {
            // Returning the JSON response if HTTP status response code is 200/201
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              // Returns JSON object if the response is of type JSON.
              return response.json();
            } else {
              // Returns string if the response is of type string.
              return response.text();
            }
          } else {
            // Catch other HTTP status response.
            setVictimList(null);
            setIsDataReady(true);
            // Setting the actual status to setIsResponseOk()
            setIsResponseOk(response.status.toString());
            throw new Error(response.status.toString());
          }
        })
        .then(async response => {
          console.log(response);
          // To catch EmergencyResponseDemo service error.
          if (
            response.message === "EmergencyResponseDemo service error message"
          ) {
            setVictimList(null);
            setIsDataReady(false);
            setIsResponseOk("EmergencyResponseDemo service");
          } else {
            setIsDataReady(true);
            setVictimList(response.map.victims.list);
            setIsResponseOk(true);
          }
        })
        .catch(error => {
          if (
            error.message === "NetworkError when attempting to fetch resource."
          ) {
            setVictimList(null);
            setIsDataReady(false);
            setIsResponseOk("FindMyRelative service");
          }
          console.log(error);
        });
    }
  };

  return (
    <Page header={Header}>
      <SearchForm onFormSubmit={fetchDetails}></SearchForm>
      <DisplayList
        responseOk={isResponseOk}
        isReady={isDataReady}
        dataArray={victimList}
      ></DisplayList>
    </Page>
  );
};

export default App;
