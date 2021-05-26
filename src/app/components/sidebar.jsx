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
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [tel, setTel] = useState("");

  let currentFName, currentLName, currentTlf;

  let heading = "Nuevo contacto";

  if (currentContact != null) {
    heading = "Editar contacto"
    let fullName = currentContact.get("n")._data.split(";");
    currentFName = fullName[1];
    currentLName = fullName[0];
    currentTlf = currentContact.get("tel")._data;
    if (Array.isArray(currentTlf)) {
      currentTlf = currentTlf[1];
    }
  }

  const resetInputs = () => {
    setContactInfo(defaultContactInfo);
    dispatch(getContact(-1));
  };

  const handleAddNew = () => {
    if (isNaN(tel)) {
      alert("Introduce un número de teléfono válido");
      return;
    }
    let info = new vcf();
    let fn = `${fName.trim()}`;
    if (lName.trim() != "") fn += ` ${lName.trim()}`;
    const n = `${lName.trim()};${fName.trim()};;;`;
    info.set("fn", fn);
    info.set("n", n);
    info.set("tel", tel);
    dispatch(addContact(info));
  }

  return (
  <aside className="p-3 bg-light m-1 d-flex flex-column">
    <h4 className="text-center">{heading}</h4>
    <label className="d-flex flex-column mb-2">
      Nombre:
      <input
        type="text"
        placeholder="Nombre"
        value={currentFName ? currentFName : fName}
        required
        onChange={e => {currentFName = null; setFName(e.target.value);}}
      />
    </label>
    <label className="d-flex flex-column mb-2">
      Apellido:
      <input
        type="text"
        placeholder="Apellido"
        value={currentLName ? currentLName : lName}
        onChange={e => {currentLName = null; setLName(e.target.value);}}
      />
    </label>
    <label className="d-flex flex-column mb-2">
      Teléfono:
      <input
        type="text"
        placeholder="Nombre"
        value={currentTlf ? currentTlf : tel}
        required
        onChange={e => {currentTlf = null; setTel(e.target.value);}}
      />
    </label>
    <button
      className="btn btn-primary my-2"
      onClick={handleAddNew}
    >Agregar</button>
    <button
      className="btn btn-secondary"
      onClick={resetInputs}
    >Descartar</button>
  </aside>
  );
};

export default Sidebar;
