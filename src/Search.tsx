import React, {useState} from 'react';

import SearchData from './types';

interface SearchFormProps {
  onFormSubmit: (data: SearchData) => void;
}

const SearchForm: React.FC<SearchFormProps> = props => {
  const [name, setName] = useState('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    props.onFormSubmit({name});
    // Prevent page reload
    e.preventDefault();
    // Clear input field
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="search"
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
      />
      <input type="submit" value="Search" />
    </form>
  );
};

export default SearchForm;
