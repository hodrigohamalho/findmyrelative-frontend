import { VictimDetail, ShelterDetail } from '../types'

export const REQUEST_DETAILS = 'REQUEST_DETAILS'
export const RECIEVE_DETAILS = 'RECIEVE_DETAILS'
export const RECIEVE_SHELTER = 'RECIEVE_SHELTER'

export interface Action {
  type: string;
}

interface RequestDetailsAction {
  payload: {
    name: string;
  };
}

interface RecieveDetailsAction {
  payload: {
    isSuccessful: boolean;
    data: VictimDetail[];
  };
}

interface RecieveShelterAction {
  payload: {
    id: string;
    data: ShelterDetail;
  };
}

export type RequestDetailsType = Action & RequestDetailsAction;
export type RecieveDetailsType = Action & RecieveDetailsAction;
export type RecieveShelterType = Action & RecieveShelterAction;
