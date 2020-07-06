import React, { useState, useEffect } from "react";
import Contacts from "./Contacts";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import personService from "../services/persons";
import Message from "./Message";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchString, setSearchString] = useState("");
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Update persons phone number both in database and in visible phonebook
  const updatePerson = (personToUpdate) => {
    const idToUpdate = persons.find(
      (person) => person.name === personToUpdate.name
    ).id;
    personService
      .update(idToUpdate, personToUpdate)
      .then((updatedPerson) => {
        const updateIndex = persons.findIndex(
          (person) => person.id === updatedPerson.id
        );
        const newPersons = [...persons];
        newPersons[updateIndex] = updatedPerson;
        setPersons(newPersons);
      })
      .catch((error) => {
        setErrorMessage(
          `${personToUpdate.name} has already been removed from server`
        );
        setTimeout(() => setErrorMessage(null), 3000);
      });
  };

  // Attempt to add a new person
  const addPerson = (event) => {
    event.preventDefault();
    const names = persons.map((person) => person.name);
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    // If person is found, phone number can be updated
    if (names.includes(newName)) {
      const confirmation = window.confirm(
        `${newPerson.name} is already in the phonebook, replace the old number with a new one?`
      );
      if (confirmation) {
        updatePerson(newPerson);
      }
      // Else a new entry is added
    } else {
      personService.create(newPerson).then((addedPerson) => {
        setPersons(persons.concat(addedPerson));
        setMessage(`Added ${addedPerson.name} to phonebook`);
        setTimeout(() => setMessage(null), 3000);
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchString(event.target.value);
  };

  const dataHook = () => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  };
  useEffect(dataHook, []);

  const removePerson = (personToRemove) => {
    return () => {
      const confirmation = window.confirm(`Delete ${personToRemove.name}?`);
      if (!confirmation) {
        return null;
      }
      personService.remove(personToRemove.id).then(() => {
        setPersons(persons.filter((person) => person.id !== personToRemove.id));
      });
    };
  };

  // Filter persons, case insensitive match to search string
  const shownPersons =
    searchString === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(searchString.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} color="green" />
      <Message message={errorMessage} color="red" />
      <div>
        <Filter value={searchString} changer={handleSearchChange} />
      </div>
      <h2>Add a new</h2>
      <PersonForm
        submit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Contacts persons={shownPersons} removePerson={removePerson} />
    </div>
  );
};

export default App;
