import { search } from "../../assets/icons";
import React, { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { searchContact } from "../redux/actions";
import Contact from "./contact";

const Dashboard = props => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contactsToList);

  let contactsToList;
  if (contacts != null){
    contactsToList = contacts.map((vCard, idx) => {
      return <Contact key={idx} idx={idx} vCard={vCard} />
    });
  }

  const handleChangeSearch = e => {
    const query = e.target.value;
    dispatch(searchContact(query));
  };

  return (
    <main className="">
      <div className="d-flex align-items-center search px-4">
        <span className="ps-2 pe-4 w-100">
          <input
            className="form-control"
            type="search"
            placeholder="Buscar contacto"
            aria-label="Buscar contacto"
            onChange={handleChangeSearch}
          />
        </span>
      </div>
      <div className="results px-4">
        <div className="contacts-wrapper d-flex flex-wrap row mx-0">
          {contactsToList}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;