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
  Title
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
                {props.data.status !== "REPORTED" && (
                  <FlexItem>Shelter:</FlexItem>
                )}
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
