import React, { useEffect, useState } from "react";

import {
  Alert,
  PageSection,
  Split,
  SplitItem,
  Flex,
  FlexItem,
  FlexModifiers,
  Card,
  CardHeader,
  CardBody,
  Title,
  GridItem
} from "@patternfly/react-core";
import mapboxgl from "mapbox-gl";
import marker from "./icons/marker-red.png";
import shelter from "./icons/shelter.png";

interface MapDisplayProps {
  position: any;
  id: string;
  status: string;
}

const mapPointLayer = (
  name: string,
  lon: string,
  lat: string,
  size: number
): any => {
  return {
    id: name,
    type: "symbol",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [lon, lat]
            }
          }
        ]
      }
    },
    layout: {
      "icon-image": name,
      "icon-size": size
    }
  };
};

const MapDisplay: React.FC<MapDisplayProps> = props => {
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [props.position.lon, props.position.lat],
      zoom: 10
    });
    map.on("load", () => {
      map.loadImage(marker, (err: Error, image: HTMLImageElement) => {
        if (err) throw err;
        map.addImage("marker", image);
        map.addLayer(
          mapPointLayer("marker", props.position.lon, props.position.lat, 0.15)
        );
      });
      if (props.status !== "REPORTED") {
        map.loadImage(shelter, (err: Error, image: HTMLImageElement) => {
          if (err) throw err;
          map.addImage("shelter", image);
          fetch(process.env.REACT_APP_BACKEND_URL + `/find/shelter/${props.id}`)
            .then(response => response.json())
            .then(jsonData => {
              map.addLayer(
                mapPointLayer(
                  "shelter",
                  jsonData.map.shelter.map.lon,
                  jsonData.map.shelter.map.lat,
                  2
                )
              );
            });
        });
      }
    });
  });
  return <div id={"map"} style={{ width: "500px", height: "400px" }}></div>;
};

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
  return (
    <>
      <GridItem span={3}>Designated Shelter: </GridItem>
      <GridItem span={9}>{shelterName}</GridItem>
    </>
  );
};

interface VictimDetailProps {
  data: any;
}

const status = {
  assigned: "ASSIGNED",
  reported: "REPORTED",
  rescued: "RESCUED"
};

const VictimDetail: React.FC<VictimDetailProps> = props => {
  const [address, setAddress] = useState("");
  const [neighbourAddress, setNeighbourAddress] = useState("");
  console.log("longitude ::" + props.data.lon + "latitude: ::" + props.data.lat)
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
        let neighbouringLocations = [];

        // To show multiple neighbor location
        /*for (let i = 1; i < jsonData.features.length; i++) {
          // Setting the Victim's locations
          neighbouringLocations.push(jsonData.features[i].place_name);
        }*/

        // To show a random nearby location to Victim's location.
        neighbouringLocations.push(jsonData.features[1].place_name);
        // Setting the Victim's location
        setAddress(jsonData.features[0].place_name);

        setNeighbourAddress(neighbouringLocations.toString());
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
        <Split gutter="md">
          <SplitItem>
            <MapDisplay
              id={props.data.id}
              status={props.data.status}
              position={{ lat: props.data.lat, lon: props.data.lon }}
            />
          </SplitItem>
          <SplitItem>
            <Flex>
              <Flex breakpointMods={[{ modifier: FlexModifiers.column }]}>
                <FlexItem>Status:</FlexItem>
                <FlexItem>People:</FlexItem>
                <FlexItem>Phone:</FlexItem>
                <FlexItem>Needs First Aid:</FlexItem>
                <FlexItem>Location:</FlexItem>
                {props.data.status === status.reported ||
                props.data.status === status.assigned ? (
                  <FlexItem>Neighboring Location:</FlexItem>
                ) : null}
                {props.data.status !== status.reported ? (
                  <FlexItem>Shelter:</FlexItem>
                ) : null}
                <FlexItem>Timestamp:</FlexItem>
              </Flex>
              <Flex breakpointMods={[{ modifier: FlexModifiers.column }]}>
                <FlexItem>
                  {props.data.status === status.rescued
                    ? "RESCUED, victim is at shelter"
                    : props.data.status}
                </FlexItem>
                <FlexItem>{props.data.numberOfPeople}</FlexItem>
                <FlexItem>{props.data.victimPhoneNumber}</FlexItem>
                {props.data.medicalNeeded ? (
                  <FlexItem>Required.</FlexItem>
                ) : null}
                {!props.data.medicalNeeded ? (
                  <FlexItem>Not Required.</FlexItem>
                ) : null}
                <FlexItem>{address}</FlexItem>
                {props.data.status === status.assigned ||
                props.data.status === status.reported ? (
                  <FlexItem>{neighbourAddress}</FlexItem>
                ) : null}

                {props.data.status !== status.reported ? (
                  <ShelterDetail id={props.data.id}>Shelter:</ShelterDetail>
                ) : null}
                <FlexItem>
                  {new Date(props.data.timeStamp).toDateString()}
                </FlexItem>
              </Flex>
            </Flex>
          </SplitItem>
        </Split>
      </CardBody>
    </Card>
  );
};

interface DisplayListProps {
  isReady: boolean;
  responseOk: any;
  dataArray: any;
}

const DisplayList: React.FC<DisplayListProps> = props => {
  let content: any;
  if (props.dataArray === undefined) {
    content = "";
  } else if (props.dataArray.length === 0) {
    content = <Alert variant="danger" isInline title="No data available" />;
  } else {
    content = props.dataArray.map((val: any, key: number) => (
      <li key={key}>
        <VictimDetail data={val.map}></VictimDetail>
      </li>
    ));
  }

  if (props.responseOk == "FindMyRelative service") {
    content = (
      <Alert
        variant="danger"
        isInline
        title="Error: FindMyRelative service is temporarily down. Please try after sometime!"
      />
    );
  }
  if (props.responseOk == "EmergencyResponseDemo service") {
    content = (
      <Alert
        variant="danger"
        isInline
        title="Error: EmergencyResponseDemo service is temporarily down. Please try after sometime!"
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
