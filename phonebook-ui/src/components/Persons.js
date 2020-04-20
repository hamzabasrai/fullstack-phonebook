import React from "react";

const Person = ({ person, handleDelete }) => {
  
  const showDeleteDialog = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      handleDelete(person);
    }
  };

  return (
    <div>
      <p style={{ display: "inline" }}>
        {person.name} {person.number}
      </p>
      <button onClick={showDeleteDialog}>Delete</button>
    </div>
  );
};

const Persons = ({ persons, handleDelete }) => (
  <>
    {persons.map((person) => (
      <Person key={person.id} person={person} handleDelete={handleDelete} />
    ))}
  </>
);

export default Persons;
