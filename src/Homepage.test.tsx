import React from 'react'
import Enzyme from 'enzyme'
import { Homepage } from './Homepage'

const { shallow } = Enzyme

it('should render itself and subcomponents', () => {
  const wrapper = shallow(<Homepage />)
  expect(wrapper.find('Page')).toHaveLength(1)
  expect(wrapper.find('PageSection')).toHaveLength(1)
  expect(wrapper.find('SearchBar')).toHaveLength(1)
})
