import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Text } from '@patternfly/react-core'
import { fetchShelter } from '../redux/actionCreators'
import { RootState } from '../redux/reducers'
import { ShelterDetail } from '../types'

interface OwnProps {
  id: string;
  status: string;
}

type ShelterAddressProps = OwnProps & StateProps & PropsFromRedux;

const ShelterAddress: React.FC<ShelterAddressProps> = ({
  id,
  status,
  fetchShelter,
  shelters
}) => {
  if (status === 'REPORTED') {
    return null
  } else if (!shelters[id]) {
    fetchShelter(id)
    return null
  } else {
    return <Text>{`Shelter: ${shelters[id].name}`}</Text>
  }
}

interface StateProps {
  shelters: { [id: string]: ShelterDetail };
}
const mapState = (state: RootState): StateProps => {
  return { shelters: state.shelter }
}

const mapDispatch = { fetchShelter }

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ShelterAddress)
