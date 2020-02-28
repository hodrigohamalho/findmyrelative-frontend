export interface VictimDetail {
  id: string;
  lat: string;
  lon: string;
  medicalNeeded: boolean;
  numberOfPeople: number;
  victimName: string;
  victimPhoneNumber: string;
  timeStamp: number;
  status: string;
  address: string;
}

export interface ShelterDetail {
  lat: string;
  lon: string;
  name: string;
}

export default interface SearchInput {
  name: string;
}
