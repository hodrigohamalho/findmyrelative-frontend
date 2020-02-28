import React from 'react'
import Enzyme from 'enzyme'

import SearchBar from './SearchBar'

const { shallow } = Enzyme

function setup () {
  const props = {
    onFormSubmit: jest.fn()
  }
  const enzymeWrapper = shallow(<SearchBar {...props} />)
  return { props, enzymeWrapper }
}

it('should render itself and subcomponents', () => {
  const { enzymeWrapper } = setup()
  expect(enzymeWrapper.find('form')).toHaveLength(1)
  expect(enzymeWrapper.find('TextInput')).toHaveLength(1)
})

it('should run callback on submit', () => {
  const { props, enzymeWrapper } = setup()
  enzymeWrapper.simulate('submit', new Event('click'))
  expect(props.onFormSubmit).toHaveBeenCalled()
})
