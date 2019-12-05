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

interface MapDisplayProps {
  position: any;
}

const MapDisplay: React.FC<MapDisplayProps> = props => {
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [props.position.lon, props.position.lat],
      zoom: 13
    });
    map.on("load", () => {
      map.loadImage(marker, (err: Error, image: HTMLImageElement) => {
        if (err) throw err;
        map.addImage("marker", image);
        map.addLayer({
          id: "points",
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
                    coordinates: [props.position.lon, props.position.lat]
                  }
                }
              ]
            }
          },
          layout: {
            "icon-image": "marker",
            "icon-size": 0.15
          }
        });
      });
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
