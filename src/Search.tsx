import React, { useState } from "react";
import { PageSection, TextInput, Button } from "@patternfly/react-core";

import SearchData from "./types";

interface SearchFormProps {
  onFormSubmit: (data: SearchData) => void;
}

const SearchForm: React.FC<SearchFormProps> = props => {
  const [name, setName] = useState("");
  const handleNameChange = (value: string) => setName(value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    props.onFormSubmit({ name });
    // Prevent page reload
    e.preventDefault();
  };

  return (
    <PageSection>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="search"
          placeholder="Name"
          style={{ maxWidth: "20em", marginRight: "1em", alignItems: "center" }}
          isRequired={true}
          value={name}
          onChange={handleNameChange}
          aria-label="Search by Name"
        />
        <Button type="submit" aria-label="search" isInline={true}>
          Search
        </Button>
      </form>
    </PageSection>
  );
};

export default SearchForm;
