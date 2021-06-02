import React from "react";
import Contact from "./contact";

const ListContacts = props => {
  let results = (
    <div className="d-flex w-100 justify-content-center align-items-center">
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

export default ListContacts;
