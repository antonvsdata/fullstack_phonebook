import React from "react";

const Contact = ({ person, removePerson }) => {
  return (
    <div>
      <span>
        {person.name} {person.number}{" "}
      </span>
      <button onClick={removePerson(person)}>delete</button>
    </div>
  );
};

const Contacts = ({ persons, removePerson }) => {
  return persons.map((person) => (
    <Contact key={person.name} person={person} removePerson={removePerson} />
  ));
};

export default Contacts;
