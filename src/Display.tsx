import React, { useEffect } from "react";

import {
  PageSection,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody
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
      zoom: 12
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
  return <div id={"map"} style={{ maxWidth: "500px", height: "400px" }}></div>;
};

interface VictimDetailProps {
  data: any;
}

const VictimDetail: React.FC<VictimDetailProps> = props => {
  return (
    <Card>
      <CardHeader>{props.data.victimName}</CardHeader>
      <CardBody>
        <Grid>
          <GridItem span={3}>Status:</GridItem>
          <GridItem span={9}> {props.data.status} </GridItem>

          <GridItem span={3}>People:</GridItem>
          <GridItem span={9}> {props.data.numberOfPeople} </GridItem>

          <GridItem span={3}>Phone:</GridItem>
          <GridItem span={9}> {props.data.victimPhoneNumber} </GridItem>

          <GridItem span={3}>Needs First-Aid:</GridItem>
          <GridItem span={9}> {props.data.medicalNeeded.toString()} </GridItem>

          <GridItem span={3}>Timestamp:</GridItem>
          <GridItem span={9}>
            {new Date(props.data.timeStamp).toDateString()}
          </GridItem>

          <GridItem span={12}>
            <MapDisplay
              id={props.data.id}
              status={props.data.status}
              position={{ lat: props.data.lat, lon: props.data.lon }}
            ></MapDisplay>
          </GridItem>
        </Grid>
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
    content = <p>503 service unavailable.</p>;
  }
  return (
    <PageSection>
      <ul>{content}</ul>
    </PageSection>
  );
};

export default DisplayList;
