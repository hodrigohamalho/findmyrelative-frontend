import React from 'react';

import {
  PageSection,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
} from '@patternfly/react-core';

interface VictimDetailProps {
  data: any;
}

const VictimDetail: React.FC<VictimDetailProps> = props => {
  console.log(props.data);
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
        </Grid>
      </CardBody>
    </Card>
  );
};

interface DisplayListProps {
  isReady: boolean;
  dataArray: any;
}

const DisplayList: React.FC<DisplayListProps> = props => {
  if (!props.isReady) {
    return (
      <PageSection>
        <p>Loading...</p>
      </PageSection>
    );
  } else if (props.dataArray.length === 0)
    return (
      <PageSection>
        <p>Not data available.</p>
      </PageSection>
    );
  return (
    <PageSection>
      <ul>
        {props.dataArray.map((val: any, key: number) => {
          return (
            <li key={key}>
              <VictimDetail data={val.map}></VictimDetail>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
};

export default DisplayList;
