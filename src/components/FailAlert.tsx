import React from 'react'
import { Alert } from '@patternfly/react-core'

const FailAlert: React.FC = () => (
  <Alert
    variant="danger"
    title="Error communicating with the backend API"
    isInline
  />
)

export default FailAlert
