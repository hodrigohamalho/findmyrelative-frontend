import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../redux/reducers'
import LoadingSpinner from './LoadingSpinner'
import DisplayList from './DisplayList'
import FailAlert from './FailAlert'

type DisplaySectionProps = PropsFromRedux;

export const DisplaySection: React.FC<DisplaySectionProps> = ({
  isFetching,
  isSuccessful,
  data
}) => {
  switch (true) {
    case isFetching:
      return <LoadingSpinner />
    case isSuccessful:
      return <DisplayList data={data} />
    default:
      return <FailAlert />
  }
}

const mapStateToProps = (state: RootState) => state.details

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DisplaySection)
