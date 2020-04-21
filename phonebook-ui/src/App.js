import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const persons = await personService.getAll();
      setPersons(persons);
    };
    fetchData();
  }, []);

  const showMessage = (message, isError) => {
    setIsError(isError);
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const updatePerson = async (existing) => {
    const action = window.confirm(
      `${newName} is already in the phonebook, replace the old number with a new one?`
    );
    if (action) {
      const update = { name: newName, number: newNumber };
      const updatedPerson = await personService.update(existing.id, update);
      setPersons(
        persons.map((person) =>
          person.id !== existing.id ? person : updatedPerson
        )
      );
      setNewName("");
      setNewNumber("");
      showMessage(`${updatedPerson.name}'s number was updated`, false);
    }
  };

  const addPerson = async (event) => {
    event.preventDefault();
    const existing = persons.find((person) => person.name === newName);
    if (existing !== undefined) {
      updatePerson(existing);
      return;
    }
    const person = { name: newName, number: newNumber };
    try {
      const newPerson = await personService.create(person);
      setPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
      showMessage(`${newPerson.name} was added successfully`, false);
    } catch (error) {
      const message = error.response.data.error;
      const nameError = message.includes("name");
      const numberError = message.includes("number");

      if (nameError && numberError) {
        showMessage(
          `Name ${newName} is too short (3). Number ${newNumber} is too short (8)`,
          true
        );
      } else if (nameError && !numberError) {
        showMessage(`Name ${newName} is too short (3).`, true);
      } else if (!nameError && numberError) {
        showMessage(`Number ${newNumber} is too short (8)`, true);
      } else {
        showMessage(`Unknown Error`, true);
      }
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDelete = async (toDelete) => {
    try {
      await personService.remove(toDelete.id);
      showMessage(`${toDelete.name} was deleted successfully`, false);
      setPersons(persons.filter((person) => person.id !== toDelete.id));
    } catch (error) {
      showMessage(
        `${toDelete.name} has already been deleted from server`,
        true
      );
      setPersons(persons.filter((person) => person.id !== toDelete.id));
    }
  };

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={isError} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a Person</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
