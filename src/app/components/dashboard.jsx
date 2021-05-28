import React, { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { searchContact } from "../redux/actions";
import Contact from "./contact";
// Background images
import { imgs } from "../../assets";

const Dashboard = props => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.contactsToList);

  let results;
  if (contacts != null) {
    if (!contacts.length) {
      results = (
        <div className="d-flex h-25 w-100 justify-content-center align-items-center">
          <div className="p-3 no-contacts">
            <h1 className="fs-2">No se encontraron contactos</h1>
          </div>
        </div>
      );
    } else {
      let contactsToList = contacts.map((vCard, idx) => {
        return <Contact key={idx} idx={idx} vCard={vCard} />
      });
      results = (
        <div className="d-flex flex-wrap row mx-0">
          {contactsToList}
        </div>
      )
    }
  } else {
    results = (
      <div className="d-flex h-25 w-100 justify-content-center align-items-center">
        <div className="p-3 no-contacts">
          <h1 className="fs-2">Carga un archivo vCard o crea contactos</h1>
          <p className="text-center fw-bold fs-6">Tus contactos aparecerán aquí</p>
        </div>
      </div>
    );
  }

  const handleChangeSearch = e => {
    if (contacts == null) {
      return;
    }
    const query = e.target.value;
    dispatch(searchContact(query));
  };

  return (
    <main>
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
        {results}
      </div>
    </main>
  );
};

export default Dashboard;