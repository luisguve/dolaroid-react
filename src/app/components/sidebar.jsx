import React, { useState, useEffect } from "react";
import vcf from "vcf";
import { icons } from "../../assets";
import { useToasts } from "react-toast-notifications";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { addContact, editContact, getContact, deleteContact } from "../redux/actions";
import Footer from "./footer";

const Sidebar = props => {
  const dispatch = useDispatch();
  const currentContact = useSelector(state => state.contacts.currentContact);
  const listingBackgrounds = useSelector(state => state.settings.listBackgrounds);
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
    // Hide Editor
    setAddingNewContact(false);
    addToast('Contacto agregado', { appearance: 'success' });
  }

  const handleDelete = () => {
    dispatch(deleteContact(currentContact.idx));
    setAddingNewContact(false);
    addToast(currentContact.get("fn")._data + ' eliminado', { appearance: 'success' });
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
          resetInputs={() => {
            dispatch(getContact(-1));
            setAddingNewContact(false);
          }}
          discardLabel={discardLabel}
        />
        <Footer />
      </aside>
      {
        !listingBackgrounds &&
        <button
          className="p-2 btn btn-primary rounded-circle d-md-none add"
          onClick={() => setAddingNewContact(true)}
        >
          +
        </button>
      }
    </div>
  );
};

const Editor = props => {
  let contact = {
    photo: props.photo,
    fName: props.fName,
    lName: props.lName,
    tel: props.tel
  };
  if ((contact.fName || contact.lName) && contact.tel) {
    contact.valid = true;
  }
  const [input, setInput] = useState(contact);
  const [phone, setPhone] = useState({
    label: "Teléfono:",
    valid: true
  });
  const { addToast } = useToasts();
  const validatePhone = number => {
    if (!number) return {
      label: "Teléfono:",
      valid: true
    };
    // Does the phone number have just numbers?
    if (/\D/.test(number)) {
      return {
        label: "El teléfono debe contener solo dígitos",
        valid: false
      };
    }
    switch(number.length) {
    case 1:
      // Does the phone number start with 0?
      if (!/^0/.test(number)) {
        return {
          label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
          valid: false
        };
      }
      break;
    case 2:
      // Does the phone number start with 04?
      if (!/^04/.test(number)) {
        return {
          label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
          valid: false
        };
      }
      break;
    case 3:
      // Does the phone number start with 04[1|2]?
      if (!/^04[1|2]/.test(number)) {
        return {
          label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
          valid: false
        };
      }
      break;
    case 4:
      // Does the phone number start with 04[1|2][2|4|6]?
      if (!/^04[1|2][2|4|6]/.test(number)) {
        return {
          label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
          valid: false
        };
      }
      break;
    default:
      // Does the phone number have more than 11 characters?
      if (number.length > 11) {
        return {
          label: "El teléfono debe contener 11 dígitos",
          valid: false
        };
      }
    }
    return {
      label: "Teléfono:",
      valid: true
    };
  };
  const validatePhoneBlur = e => {
    const number = e.target.value;
    if (!number) return;
    // Does the phone number have just numbers?
    if (/\D/.test(number)) {
      setPhone({
        label: "El teléfono debe contener solo dígitos",
        valid: false
      });
      return;
    }
    // Does the phone number start with 04[1|2][2|4|6]?
    if (!/^04[1|2][2|4|6]/.test(number)) {
      setPhone({
        label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
        valid: false
      });
      return;
    }
    // Does the phone number have more than 11 characters?
    if (number.length != 11) {
      setPhone({
        label: "El teléfono debe contener 11 dígitos",
        valid: false
      });
      return;
    }
    setPhone({
      label: "Teléfono:",
      valid: true
    });
  }
  // Update input if a contact is being edited
  useEffect(() => {
    setInput(contact);
    setPhone(validatePhone(contact.tel));
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
  const handleChangePhoto = e => {
    setInput(Object.assign({}, input, {photo: e.target.value}));
  }
  const handleChangeFName = e => {
    let valid = ((e.target.value || input.lName) && (input.tel && phone.valid));
    setInput(Object.assign({}, input, {fName: e.target.value, valid: valid}));
  };
  const handleChangeLName = e => {
    let valid = ((input.fName || e.target.value) && (input.tel && phone.valid));
    setInput(Object.assign({}, input, {lName: e.target.value, valid: valid}));
  };
  const handleChangeTel = e => {
    let phone = validatePhone(e.target.value);
    let valid = ((input.fName || input.lName) && (e.target.value && phone.valid));
    setInput(Object.assign({}, input, {tel: e.target.value, valid: valid}));
    setPhone(phone);
  };
  const handleDelete = () => {
    props.handleDelete();
  };
  let inputElement; // input type file
  const readFile = file => {
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (!validExtensions.includes(fileType)) {
      addToast('Selecciona un archivo JPG o PNG', { appearance: 'error' });
      return;
    }
    let reader = new FileReader();
    reader.onloadend = () => {
      setInput(Object.assign({}, input, {photo: reader.result}));
    }
    reader.readAsDataURL(file);
  };
  const dragText = "Arrastra una foto aquí";
  const releaseText = "Suelta la foto";
  const [photoTooltip, setPhotoTooltip] = useState(dragText);
  const [dragAreaClass, setDragAreaClass] = useState("drag-area");

  return (
    <div className="d-flex flex-column">
      <h4 className="text-center">{props.heading}</h4>
      <div className={"photo-container ".concat(dragAreaClass)}
        onDragOver={e => {
          e.preventDefault();
          setDragAreaClass("drag-area active");
          setPhotoTooltip(releaseText);
        }}
        onDragLeave={() => {
          setDragAreaClass("drag-area");
          setPhotoTooltip(dragText);
        }}
        onDrop={e => {
          e.preventDefault();
          setDragAreaClass("drag-area");
          setPhotoTooltip(dragText);
          readFile(e.dataTransfer.files[0]);
        }}
      >
        <img src={input.photo} />
        <div className="photo-tooltip">
          <p className="mb-0 mt-1">{photoTooltip}</p>
        </div>
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
        <span className="text-muted">Nombre:</span>
        <input
          type="text"
          placeholder="Nombre"
          value={input.fName}
          onChange={handleChangeFName}
          className="form-control"
        />
      </label>
      <label className="d-flex flex-column mb-2">
        <span className="text-muted">Apellido:</span>
        <input
          type="text"
          placeholder="Apellido"
          value={input.lName}
          onChange={handleChangeLName}
          className="form-control"
        />
      </label>
      <label className="d-flex flex-column mb-2">
        <span className="text-muted">{phone.label}</span>
        <input
          type="text"
          placeholder="Ej: 0424 906 9351"
          value={input.tel}
          onChange={handleChangeTel}
          onBlur={validatePhoneBlur}
          className={"form-control".concat(!phone.valid ? " invalid" : "")}
        />
      </label>
      <div className="d-flex flex-column my-2">
        {
          props.editing &&
          <span className="w-100 mt-2 d-md-none"><button
            className="btn btn-danger w-100"
            onClick={handleDelete}
          >Eliminar contacto</button></span>
        }
        <div className="d-flex mt-2">
          <span className="w-50 pe-1"><button
            className={
              "btn btn-secondary w-100".concat(
                (!(input.fName || input.lName || input.tel) && input.photo == icons.profilePic2) ?
                " disabled" : ""
              )
            }
            onClick={resetInputs}
          >{props.discardLabel}</button></span>
          <span className="w-50 mt-md-0 ps-1"><button
            className={
              "btn btn-primary w-100".concat(
                !input.valid || !phone.valid || input.tel.length != 11 ? " disabled" : ""
              )
            }
            onClick={handleSave}
          >{props.saveLabel}</button></span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
