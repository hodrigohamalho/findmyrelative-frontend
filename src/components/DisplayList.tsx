import React from 'react'
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Divider,
  EmptyState,
  EmptyStateBody,
  Label,
  Split,
  SplitItem,
  Title,
  Text,
  TextContent
} from '@patternfly/react-core'
import { VictimDetail } from '../types'
import MapDisplay from './MapDisplay'
import ShelterAddress from './ShelterAddress'

const EmptyList: React.FC = () => (
  <EmptyState>
    <Title size="lg">No results found</Title>
    <EmptyStateBody>No matching names found.</EmptyStateBody>
  </EmptyState>
)

interface DisplayTitleProps {
  name: string;
  status: string;
}
const DisplayTitle: React.FC<DisplayTitleProps> = ({ name, status }) => (
  <CardHeader>
    <Title size="xl" headingLevel="h3">
      {name}
    </Title>
    <Chip isReadOnly>{status}</Chip>
  </CardHeader>
)

interface DisplayListProps {
  data: VictimDetail[];
}
const DisplayList: React.FC<DisplayListProps> = ({ data }) => {
  if (data.length === 0) {
    return <EmptyList />
  }
  return (
    <>
      {data.map(({ id, lat, lon, ...detail }) => (
        <Card key={id}>
          <DisplayTitle name={detail.victimName} status={detail.status} />
          <Divider />
          <CardBody>
            <Split gutter="md">
              <SplitItem>
                <MapDisplay id={id} latitude={lat} longitude={lon} />
              </SplitItem>
              <SplitItem>
                <TextContent>
                  <Text>{`Reported on ${new Date(
                    detail.timeStamp
                  ).toDateString()}`}</Text>
                  <Text>{`Phone: ${detail.victimPhoneNumber}`}</Text>
                  <Text>{detail.address}</Text>
                  <ShelterAddress id={id} status={detail.status} />
                  <Chip isReadOnly>
                    People
                    <Badge isRead>{detail.numberOfPeople}</Badge>
                  </Chip>
                  {detail.medicalNeeded && (
                    <Label isCompact>Medical attention needed</Label>
                  )}
                </TextContent>
              </SplitItem>
            </Split>
          </CardBody>
        </Card>
      ))}
    </>
  )
}

export default DisplayList
