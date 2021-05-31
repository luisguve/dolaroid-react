import React, { useState, useEffect } from "react";
import vcf from "vcf";
import { icons } from "../../assets";
import { useToasts } from "react-toast-notifications";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { addContact, editContact, getContact } from "../redux/actions";
import Footer from "./footer";

const Sidebar = props => {
  const dispatch = useDispatch();
  const currentContact = useSelector(state => state.contacts.currentContact);
  const { addToast } = useToasts();

  let heading = "Nuevo contacto";
  let saveLabel = "Agregar";
  let discardLabel = "Descartar";

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
    addToast('Contacto agregado', { appearance: 'success' });
  }

  return (
    <div className="h-100 d-flex justify-content-center">
      <aside className="p-3 pb-0 bg-transparent m-1 d-flex flex-column justify-content-between">
        <Editor
          {...currentContactInfo}
          heading={heading}
          handleSave={handleSave}
          saveLabel={saveLabel}
          resetInputs={() => {dispatch(getContact(-1))}}
          discardLabel={discardLabel}
        />
        <Footer />
      </aside>
    </div>
  );
};

const Editor = props => {
  let contact = {
    photo: props.photo,
    fName: props.fName,
    lName: props.lName,
    tel: props.tel,
  };
  const [input, setInput] = useState(contact);
  const dragText = "Arrastra una foto aquí";
  const releaseText = "Suelta la foto";
  const [photoText, setPhotoText] = useState(dragText);
  const [dragAreaClass, setDragAreaClass] = useState("drag-area");
  // Update input if a contact is being edited
  useEffect(() => {
    setInput(contact);
  }, [props]);
  const handleSave = () => {
    props.handleSave(input);
    setInput({
      photo: icons.profilePic2,
      fName: "",
      lName: "",
      tel: ""
    });
  };
  const resetInputs = () => {
    props.resetInputs();
    setInput({
      photo: icons.profilePic2,
      fName: "",
      lName: "",
      tel: ""
    });
  }
  const handleChangeFName = e => {
    setInput(Object.assign({}, input, {fName: e.target.value}));
  };
  const handleChangePhoto = e => {
    setInput(Object.assign({}, input, {photo: e.target.value}));
  }
  const handleChangeLName = e => {
    setInput(Object.assign({}, input, {lName: e.target.value}));
  };
  const handleChangeTel = e => {
    setInput(Object.assign({}, input, {tel: e.target.value}));
  };
  let inputElement; // input type file
  const readFile = file => {
    if (file.type !== "image/jpeg") {
      console.log(file.type);
      console.log('Selecciona un archivo JPG', { appearance: 'error' });
      return;
    }
    let reader = new FileReader();
    reader.onloadend = () => {
      setInput(Object.assign({}, input, {photo: reader.result}));
    }
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <h4 className="text-center">{props.heading}</h4>
      <div
        className={"photo-container ".concat(dragAreaClass)}
        onDragOver={e => {
          e.preventDefault();
          setDragAreaClass("drag-area active");
          setPhotoText(releaseText);
        }}
        onDragLeave={() => {
          setDragAreaClass("drag-area");
          setPhotoText(dragText);
        }}
        onDrop={e => {
          e.preventDefault();
          setDragAreaClass("drag-area");
          setPhotoText(dragText);
          readFile(e.dataTransfer.files[0]);
        }}
      >
        <img className="w-100" height="220" src={input.photo} />
        <p
          onDragOver={e => e.stopPropagation()}
          onDragLeave={e => e.stopPropagation()}
          onDrop={e => e.stopPropagation()}
        >{photoText}</p>
      </div>
      <button className="btn btn-secondary w-100 my-2"
        onClick={() => inputElement.click()}
        >Selecciona una foto
      </button>
      <input type="file"
        ref={input => inputElement = input } hidden
        onChange={e => {
          readFile(e.target.files[0]);
        }}
      />
      <label className="d-flex flex-column mb-2">
        Nombre:
        <input
          type="text"
          placeholder="Nombre"
          value={input.fName}
          onChange={handleChangeFName}
        />
      </label>
      <label className="d-flex flex-column mb-2">
        Apellido:
        <input
          type="text"
          placeholder="Apellido"
          value={input.lName}
          onChange={handleChangeLName}
        />
      </label>
      <label className="d-flex flex-column mb-2">
        Teléfono:
        <input
          type="text"
          placeholder="Teléfono"
          value={input.tel}
          onChange={handleChangeTel}
        />
      </label>
      <div className="d-flex my-2">
        <span className="w-50 pe-1"><button
          className="btn btn-primary w-100"
          onClick={handleSave}
        >{props.saveLabel}</button></span>
        <span className="w-50 ps-1"><button
          className="btn btn-secondary w-100"
          onClick={resetInputs}
        >{props.discardLabel}</button></span>
      </div>
    </div>
  );
};

export default Sidebar;
