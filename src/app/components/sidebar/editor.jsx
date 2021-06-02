import React, { useState, useEffect } from "react";
import { icons } from "../../../assets";
import { useToasts } from "react-toast-notifications";
import { validatePhoneFocus, validatePhoneBlur } from "./validation";

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
  const defaultPhone = {
    label: "Teléfono:",
    valid: true
  };
  const [input, setInput] = useState(contact);
  const [phone, setPhone] = useState(defaultPhone);
  const { addToast } = useToasts();
  // Update input if a contact is being edited
  useEffect(() => {
    setInput(contact);
    setPhone(validatePhoneFocus(contact.tel));
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
    setPhone(defaultPhone);
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
    let phone = validatePhoneFocus(e.target.value);
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
          onBlur={e => {
            if (e.target.value) {
              setPhone(validatePhoneBlur(e.target.value));
            }
          }}
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

export default Editor;
