import { icons } from "../../assets";
import React from "react";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";
import Modal from "./drag-modal";
// Redux
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../redux/actions";

const Navbar = props => {
  let contacts = useSelector(state => state.contacts.contacts);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleDownload = () => {
    if (!contacts.length) return;

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contacts.toString()));
    element.setAttribute('download', "contactos.vcf");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
  const handleClean = () => {
    if (!contacts.length) return;

    dispatch(actions.cleanContacts());
    addToast("Lista de contactos limpiada", { appearance: "success" });
  };
  const handleSettings = () => {
    if (window.innerWidth <= 767) {
      burgerButton.click();
    }
    dispatch(actions.listBackgrounds());
  };
  let buttonsClass = "border-0 mx-2 bg-transparent p-0 d-flex flex-md-column align-items-center";
  let disabled = "";
  if (!contacts.length) {
    disabled = " disabled";
  }
  let burgerButton;
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className={"border-bottom navbar-container d-flex align-items-md-center".concat(navOpen?" navopen":"")}>
      <nav className="navbar navbar-expand-md navbar-light bg-light w-100 py-md-0">
        <div className="container-lg mt-md-1">
          <div className="d-flex justify-content-end w-100 d-md-none">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" ref={burger => {
              burgerButton = burger;
            }} onClick={() => {
              if (navOpen) {
                setTimeout(() => {setNavOpen(false)}, 350)
              } else {
                setNavOpen(true);
              }
            }}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse justify-content-md-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className={buttonsClass}
                 onClick={() => setShowModal(true)}>
                  <img alt="" className="icon" title="Subir al chivo"
                    src={icons.vcf} />
                  <p className="m-0 text-muted">Importar</p>
                </button>
              </li>
              <li className="nav-item">
                <button className={buttonsClass.concat(disabled)}
                  onClick={handleDownload}>
                  <img alt="" title="Descargar al chivo" className="icon"
                src={icons.download} />
                  <p className="m-0 text-muted">Exportar</p>
                </button>
              </li>
              <li className="nav-item">
                <button className={buttonsClass.concat(disabled)}
                  onClick={handleClean}>
                  <img alt="" title="Limpiar lista de contactos" className="icon"
                src={icons.clean} />
                  <p className="m-0 text-muted">Eliminar todo</p>
                </button>
              </li>
              <li className="nav-item">
                <button className={buttonsClass}
                onClick={handleSettings}>
                  <img alt="" className="icon" src={icons.settings} />
                  <p className="m-0 text-muted">Personalizar</p>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {showModal && <Modal hide={() => setShowModal(false)} />}
    </div>
  );
};

export default Navbar;
