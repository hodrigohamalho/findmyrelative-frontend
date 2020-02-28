import React, { useState } from 'react'
import { TextInput, Button } from '@patternfly/react-core'
import './SearchBar.css'

interface SearchBarProps {
  onFormSubmit: (name: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFormSubmit }) => {
  const [name, setName] = useState('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    onFormSubmit(name)
    e.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        className="search-bar-input"
        type="search"
        placeholder="Name"
        value={name}
        onChange={(val) => setName(val)}
        aria-label="search input"
        isRequired
      />
      <Button type="submit" aria-label="search button" isInline={true}>
        Search
      </Button>
    </form>
  )
}

export default SearchBar
