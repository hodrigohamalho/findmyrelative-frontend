import React from 'react'
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  Spinner
} from '@patternfly/react-core'

const LoadingSpinner: React.FC = () => (
  <EmptyState>
    <EmptyStateIcon variant="container" component={Spinner} />
    <Title size="lg">Loading</Title>
  </EmptyState>
)

export default LoadingSpinner
