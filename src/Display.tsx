import React, { useState } from "react";

import {
  Alert,
  PageSection,
  Flex,
  FlexItem,
  FlexModifiers,
  Card,
  CardHeader,
  CardBody,
  Title
} from "@patternfly/react-core";

interface ShelterDetailProps {
  id: string;
}

const ShelterDetail: React.FC<ShelterDetailProps> = props => {
  const [shelterName, setShelterName] = useState("");
  fetch(process.env.REACT_APP_BACKEND_URL + `/find/shelter/${props.id}`)
    .then(response => response.json())
    .then(jsonData => {
      setShelterName(jsonData.map.shelter.map.name);
    });
  return <FlexItem>{shelterName}</FlexItem>;
};

interface VictimDetailProps {
  data: any;
}

const VictimDetail: React.FC<VictimDetailProps> = props => {
  const [address, setAddress] = useState("");
  const host = `https://api.mapbox.com/geocoding/v5/mapbox.places/${props.data.lon},${props.data.lat}.json?`;
  fetch(
    host +
      new URLSearchParams({
        access_token: process.env.REACT_APP_MAPBOX_TOKEN || ""
      })
  )
    .then(response => response.json())
    .then(jsonData => {
      if (jsonData.features.length) {
        setAddress(jsonData.features[0].place_name);
      }
    });
  return (
    <Card isHoverable>
      <CardHeader>
        <Title headingLevel="h2" size="3xl">
          {props.data.victimName}
        </Title>
      </CardHeader>
      <CardBody>
        <Flex>
          <Flex breakpointMods={[{ modifier: FlexModifiers.column }]}>
            <FlexItem>Status:</FlexItem>
            <FlexItem>People:</FlexItem>
            <FlexItem>Phone:</FlexItem>
            <FlexItem>Needs First Aid:</FlexItem>
            <FlexItem>Location:</FlexItem>
            {props.data.status !== "REPORTED" && <FlexItem>Shelter:</FlexItem>}
            <FlexItem>Timestamp:</FlexItem>
          </Flex>
          <Flex breakpointMods={[{ modifier: FlexModifiers.column }]}>
            <FlexItem>
              {props.data.status === "RESCUED"
                ? "RESCUED, victim is at shelter"
                : props.data.status}
            </FlexItem>
            <FlexItem>{props.data.numberOfPeople}</FlexItem>
            <FlexItem>{props.data.victimPhoneNumber}</FlexItem>
            <FlexItem>{String(props.data.medicalNeeded)}</FlexItem>
            <FlexItem>{address}</FlexItem>
            {props.data.status !== "REPORTED" && (
              <ShelterDetail id={props.data.id}>Shelter:</ShelterDetail>
            )}
            <FlexItem>{new Date(props.data.timeStamp).toDateString()}</FlexItem>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

interface DisplayListProps {
  isReady: boolean;
  responseOk: boolean;
  dataArray: any;
}

const DisplayList: React.FC<DisplayListProps> = props => {
  let content = props.dataArray.map((val: any, key: number) => (
    <li key={key}>
      <VictimDetail data={val.map}></VictimDetail>
    </li>
  ));
  if (props.dataArray.length === 0) {
    content = <p>No data available.</p>;
  }
  if (!props.isReady) {
    content = <p>Loading...</p>;
  }
  if (!props.responseOk) {
    content = (
      <Alert
        variant="danger"
        isInline
        title="Error: Emergency Response services unreachable"
      />
    );
  }
  return (
    <PageSection>
      <ul>{content}</ul>
    </PageSection>
  );
};

export default DisplayList;
