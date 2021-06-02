import React from "react";
import { icons } from "../../../assets";
// Toast utilities
import { useToasts } from "react-toast-notifications";
// Redux
import { useDispatch } from "react-redux";
import { getContact, deleteContact } from "../../redux/actions";

const Contact = props => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  let telf = props.vCard.get("tel")._data;
  if (telf === undefined) {
    telf = props.vCard.get("tel")[1]._data;
  }
  let name = props.vCard.get("fn")._data;
  let profilePic = props.vCard.get("photo");
  if (!profilePic) profilePic = icons.profilePic2;

  const handleMobileEdit = e => {
    if (window.innerWidth >= 768) return;
    dispatch(getContact(props.idx));
  };
  const handleCopy = e => {
    e.stopPropagation();
    // Build text
    const info = document.createElement("textarea");
    // Place in the top-left corner of screen regardless of scroll position.
    info.style = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: "2em",
      height: "2em",
      padding: 0,
      border: "none",
      outline: "none",
      boxShadow: "none",
      background: "transparent"
    };
    info.value = `Nombre: ${name} - Telefono: ${telf}`;
    // Insert into DOM
    document.body.appendChild(info);
    // Focus and select the text field
    info.focus();
    info.select();
    info.setSelectionRange(0, 99999); // For mobile devices
    // Copy the text inside the text field
    let result = "Informacion de contacto copiada";
    let theme = {appearance: "success"};
    try {
      var success = document.execCommand('copy');
      if (!success) {
        result = "No se pudo copiar al portapapeles";
        theme.appearance = "error";
      }
    } catch (err) {
      result = "No se pudo copiar al portapapeles " + err.toString();
      theme.appearance = "error";
    }
    document.body.removeChild(info);

    addToast(result, theme);
  };

  return (
    <div className="p-0 p-md-2 my-1 my-md-0 col-md-6 col-lg-4 col-xl-3">
      <div className="card p-1 h-100 flex-row flex-md-column" onClick={handleMobileEdit}>
        <img className="card-img-top photo" alt="" src={profilePic} />
        <div className="card-body d-flex flex-md-column justify-content-between pb-md-1 mt-md-2 align-items-center">
          <div><h6 className="card-title">{name}</h6>
          <p className="card-text">{telf}</p></div>
          <div className="d-flex justify-content-end justify-content-md-between w-100">
            <button className="edit bg-transparent border-0 p-1 d-none d-md-block"
              title="Editar" onClick={e => {
                e.stopPropagation();
                dispatch(getContact(props.idx));
              }}>
              <img className="img-fluid" src={icons.edit} />
            </button>
            <button className="edit bg-transparent border-0 p-1"
              title="Copiar" onClick={handleCopy}>
              <img className="img-fluid" src={icons.copy} />
            </button>
            <button className="edit bg-transparent border-0 p-1 d-none d-md-block"
              title="Eliminar" onClick={e => {
                e.stopPropagation();
                dispatch(deleteContact(props.idx));
                addToast(name + ' eliminado', { appearance: 'success' });
              }}>
              <img className="img-fluid" src={icons.trash} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
