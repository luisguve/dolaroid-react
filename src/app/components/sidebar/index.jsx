import React, { useState, useEffect } from "react";
import vcf from "vcf";
import { icons } from "../../../assets";
import { useToasts } from "react-toast-notifications";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { addContact, editContact, getContact, deleteContact } from "../../redux/actions";
import Footer from "../footer";
import Editor from "./editor";

const Sidebar = props => {
  const dispatch = useDispatch();
  const currentContact = useSelector(state => state.contacts.currentContact);
  const listingBackgrounds = useSelector(state => state.settings.listBackgrounds);
  const { addToast } = useToasts();

  let heading = "Nuevo contacto";
  let saveLabel = "Agregar";
  let discardLabel = "Descartar";
  if (window.innerWidth <= 767) {
    discardLabel = "Cancelar";
  }

  const defaultContactInfo = {
    photo: icons.profilePic2,
    fName: "",
    lName: "",
    tel: ""
  };

  let currentContactInfo = defaultContactInfo;

  if (currentContact != null) {
    heading = "Editar contacto"
    saveLabel = "Guardar";
    discardLabel = "Cancelar";
    let fullName = currentContact.get("n")._data.split(";");

    let currentTlf = currentContact.get("tel");
    if (Array.isArray(currentTlf)) {
      currentTlf = currentTlf[1]._data;
    } else {
      currentTlf = currentTlf._data;
    }

    let photo = currentContact.get("photo");
    if (!photo) photo = icons.profilePic2;

    currentContactInfo = {
      photo: photo,
      fName: fullName[1],
      lName: fullName[0],
      tel: currentTlf
    };
  }

  const handleSave = (input) => {
    if (input.tel == "" || isNaN(input.tel)) {
      addToast("Introduce un número de teléfono válido", { appearance: 'info' });
      return;
    }

    if (!(input.fName.trim().length) && !(input.lName.trim().length)) {
      addToast("Introduce un nombre", { appearance: 'info' });
      return;
    }

    let fn = input.fName.trim();
    if (input.lName.trim() != "") fn += " " + input.lName.trim();
    const n = `${input.lName.trim()};${input.fName.trim()};;;`;

    if (currentContact != null) {
      // Edit contact.
      currentContact.set("fn", fn);
      currentContact.set("n", n);
      currentContact.set("tel", input.tel);
      dispatch(editContact(currentContact.idx, currentContact));
      addToast(fn + ' actualizado', { appearance: 'success' });
      return;
    }

    // Create new contact.
    let info = new vcf();
    info.set("fn", fn);
    info.set("photo", input.photo);
    info.set("n", n);
    info.set("tel", input.tel);
    dispatch(addContact(info));
    // Hide Editor
    setAddingNewContact(false);
    addToast('Contacto agregado', { appearance: 'success' });
  }

  const handleDelete = () => {
    dispatch(deleteContact(currentContact.idx));
    setAddingNewContact(false);
    addToast(currentContact.get("fn")._data + ' eliminado', { appearance: 'success' });
  };

  const resetInputs = () => {
    dispatch(getContact(-1));
    setAddingNewContact(false);
  };

  const [addingNewContact, setAddingNewContact] = useState(false);
  // Display editor on mobile devices only if there is a contact to be edited.
  let displayEditor = (currentContact || addingNewContact) ? " d-flex" : " d-none";

  return (
    <div className="h-100 d-flex justify-content-md-center">
      <aside className={"py-3 px-xl-5 pb-0 d-md-flex flex-column justify-content-between".concat(displayEditor)} >
        <Editor
          {...currentContactInfo}
          editing={currentContact != null}
          heading={heading}
          handleSave={handleSave}
          handleDelete={handleDelete}
          saveLabel={saveLabel}
          resetInputs={resetInputs}
          discardLabel={discardLabel}
        />
        <Footer />
      </aside>
      {
        !listingBackgrounds &&
        <React.Fragment>
          <button
            className={"p-2 btn btn-danger rounded-circle d-md-none mobile quit".concat(displayEditor)}
            onClick={resetInputs}
          >
            x
          </button>
          <button
            className="p-2 btn btn-primary rounded-circle d-md-none mobile add"
            onClick={() => setAddingNewContact(true)}
          >
            +
          </button>
        </React.Fragment>
      }
    </div>
  );
};

export default Sidebar;
