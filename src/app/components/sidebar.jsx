import React, { useState } from "react";
import vcf from "vcf";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { addContact, editContact, getContact } from "../redux/actions";

const Sidebar = props => {
  const dispatch = useDispatch();
  const currentContact = useSelector(state => state.currentContact);
  const defaultContactInfo = {
    fName: "",
    lName: "",
    tel: ""
  };
  const [input, setInput] = useState(defaultContactInfo);

  let currentFName, currentLName, currentTlf;

  let heading = "Nuevo contacto";
  let saveLabel = "Agregar";
  let discardLabel = "Descartar";

  if (currentContact != null) {
    heading = "Editar contacto"
    saveLabel = "Gurardar cambios";
    discardLabel = "Descartar cambios";
    let fullName = currentContact.get("n")._data.split(";");

    let currentTlf = currentContact.get("tel");
    if (Array.isArray(currentTlf)) {
      currentTlf = currentTlf[1]._data;
    } else {
      currentTlf = currentTlf._data;
    }

    setInput({
      fName: fullName[1],
      lName: fullName[0],
      tel: currentTlf
    });
  }

  const resetInputs = () => {
    dispatch(getContact(-1));
  };

  const handleAddNew = () => {
    if (input.tel == "" || isNaN(input.tel)) {
      alert("Introduce un número de teléfono válido");
      return;
    }

    if (!(input.fName.trim().length) && !(input.lName.trim().length)) {
      alert("Introduce un nombre");
      return;
    }

    let fn = input.fName.trim();
    if (input.lName.trim() != "") fn += " " + input.lName.trim();
    const n = `${input.lName.trim()};${input.fName.trim()};;;`;

    let info = new vcf();
    info.set("fn", fn);
    info.set("n", n);
    info.set("tel", input.tel);
    dispatch(addContact(info));
    setInput(defaultContactInfo);
  }

  return (
  <aside className="p-3 bg-light m-1 d-flex flex-column">
    <h4 className="text-center">{heading}</h4>
    <label className="d-flex flex-column mb-2">
      Nombre:
      <input
        type="text"
        placeholder="Nombre"
        value={input.fName}
        onChange={e => {
          setInput(Object.assign({}, input, {fName: e.target.value}));
        }}
      />
    </label>
    <label className="d-flex flex-column mb-2">
      Apellido:
      <input
        type="text"
        placeholder="Apellido"
        value={input.lName}
        onChange={e => {
          setInput(Object.assign({}, input, {lName: e.target.value}));
        }}
      />
    </label>
    <label className="d-flex flex-column mb-2">
      Teléfono:
      <input
        type="text"
        placeholder="Teléfono"
        value={input.tel}
        onChange={e => {
          setInput(Object.assign({}, input, {tel: e.target.value}));
        }}
      />
    </label>
    <button
      className="btn btn-primary my-2"
      onClick={handleAddNew}
    >{saveLabel}</button>
    <button
      className="btn btn-secondary"
      onClick={resetInputs}
    >{discardLabel}</button>
  </aside>
  );
};

export default Sidebar;
