import React, { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { searchContact } from "../redux/actions";
import Contact from "./contact";
// Background images
import { imgs } from "../../assets";

const Dashboard = props => {
  const settings = useSelector(state => state.settings);

  const getBackground = () => {
    let defaultBg = "linear-gradient(141deg, #fff3f3 0%, #e1faff 100%)";
    if (settings.listBackgrounds) return defaultBg;
    return settings.currentBackground.url;
  };

  let style = {
    background: `${getBackground()} center center / cover no-repeat`
  };

  return (
    <main style={style}>
      {
        settings.listBackgrounds ?
        <BackgroundChooser /> : <Contacts />
      }
    </main>
  );
};

const BackgroundChooser = props => {
  const settings = useSelector(state => state.settings);
  let options = [];
  for (const id in imgs) {
    let active = "";
    if (settings.currentBackground.id == id) {
      active = "active";
    }
    options.push(
      <div className="col-4" key={id}>
        <img className="img-fluid sample" src={imgs[id].url} alt={imgs[id].name} />
        <p className="text-center"><em>{imgs[id].name}</em></p>
        {active && <p>Imagen actual</p>}
      </div>
    );
  }
  return (
    <div className="background-chooser">
      <div className="d-flex flex-wrap row mx-0">
        <h1 className="text-secondary fs-4 fw-bold text-center my-3">
          Selecciona la imagen y presiona el botón de aceptar
        </h1>
        {options}
      </div>
    </div>
  );
};

const Contacts = props => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.contactsToList);

  const handleChangeSearch = e => {
    if (contacts == null) {
      return;
    }
    const query = e.target.value;
    dispatch(searchContact(query));
  };

  return (
    <React.Fragment>
      {/* Search bar */}
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
      {/* Contacts to list */}
      <div className="results px-4">
        <Results contacts={contacts} />
      </div>
    </React.Fragment>
  );
};

const Results = props => {
  let results = (
    <div className="d-flex h-25 w-100 justify-content-center align-items-center">
      <div className="p-3 no-contacts">
        <h1 className="fs-2">Carga un archivo vCard o crea contactos</h1>
        <p className="text-center fw-bold fs-6">Tus contactos aparecerán aquí</p>
      </div>
    </div>
  );

  if (props.contacts != null) {
    if (!props.contacts.length) {
      results = (
        <div className="d-flex h-25 w-100 justify-content-center align-items-center">
          <div className="p-3 no-contacts">
            <h1 className="fs-2">No se encontraron contactos</h1>
          </div>
        </div>
      );
    } else {
      let contactsToList = props.contacts.map((vCard, idx) => {
        return <Contact key={idx} idx={idx} vCard={vCard} />
      });
      results = (
        <div className="d-flex flex-wrap row mx-0">
          {contactsToList}
        </div>
      )
    }
  }
  return (<React.Fragment>{results}</React.Fragment>);
};

export default Dashboard;