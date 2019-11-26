import React from 'react';

interface VictimDetailProps {
  data: any;
}

const VictimDetail: React.FC<VictimDetailProps> = props => {
  console.log(props.data.map);
    return <div className="victim-detail">
        <ul>
            <li>Name: {props.data.map.victimName}</li>
            <li>Status: {props.data.map.status}</li>
            <li>Latitude: {props.data.map.lat}</li>
            <li>Longitude: {props.data.map.lon}</li>
            <li>Needs medical attention: {props.data.map.medicalNeeded}</li>
            <li>People: {props.data.map.numberOfPeople}</li>
            <li>Phone: {props.data.map.victimPhoneNumber}</li>
            <li>Timestamp: {new Date(props.data.map.timeStamp).toDateString()}</li>
            </ul>
        </div>;
};

interface DisplayListProps {
  isReady: boolean;
  dataArray: any;
}

const DisplayList: React.FC<DisplayListProps> = props => {
  if (!props.isReady) {
    return <p>Loading...</p>;
  }
  return (
    <ul>
      {props.dataArray.map((val: any, key: number) => {
        return (
          <li key={key}>
            <VictimDetail data={val}></VictimDetail>
          </li>
        );
      })}
    </ul>
  );
};

export default DisplayList;
