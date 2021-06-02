import { icons } from "../../assets";
import React from "react";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../redux/actions";
// Package for reading VCF text.
import vcf from "vcf";

const Navbar = props => {
  let contacts = useSelector(state => state.contacts.contacts);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleFileContents = data => {
    let vCard;
    try {
      vCard = vcf.parse(data);
    } catch (err) {
      console.log("Invalid vcard:", err);
      addToast('archivo vCard inválido', { appearance: 'error' });
    }
    if (vCard) {
      dispatch(actions.loadContacts(vCard));
      setShowModal(false);
    }
  };
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
  return (
    <div className="border-bottom navbar-container d-flex align-items-md-center">
      <nav className="navbar navbar-expand-md navbar-light bg-light w-100">
        <div className="container-lg">
          <div className="d-flex justify-content-end w-100 d-md-none">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" ref={burger => burgerButton = burger}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse justify-content-md-center justify-content-lg-end" id="navbarNav">
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
                <button className={buttonsClass.concat(disabled)}
                onClick={handleSettings}>
                  <img alt="" className="icon" src={icons.settings} />
                  <p className="m-0 text-muted">Personalizar</p>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {showModal && <Modal setFileContents={handleFileContents} hide={() => setShowModal(false)} />}
    </div>
  );
};


const Modal = props => {
  const dragText = "Arrastra el archivo aquí";
  const releaseText = "Suelta el archivo para subirlo";
  const [ headerText, setHeaderText ] = useState(dragText);
  const [ dragAreaClass, setDragAreaClass ] = useState("drag-area");
  const { addToast } = useToasts();

  const readFile = file => {
    if (file.type !== "text/x-vcard") {
      addToast('Selecciona un archivo .VCF', { appearance: 'error' });
      setHeaderText(dragText);
      setDragAreaClass("drag-area");
      return;
    }
    let reader = new FileReader();
    reader.onload = () => {
      props.setFileContents(reader.result);
    }
    reader.readAsText(file);
  };

  let inputElement;
  return (
    <div className="modal" onClick={() => props.hide()}>
      <div className={dragAreaClass}
      onDragOver={e => {
        e.preventDefault();
        setDragAreaClass("drag-area active");
        setHeaderText(releaseText);
      }}
      onDragLeave={() => {
        setDragAreaClass("drag-area");
        setHeaderText(dragText);
      }}
      onDrop={e => {
        e.preventDefault();
        setDragAreaClass("drag-area");
        readFile(e.dataTransfer.files[0]);
      }}
      onClick={e => e.stopPropagation()}>
        <img className="upload" alt="" src={icons.vcf} />
        <header>{headerText}</header>
        <span>o...</span>
        <button onClick={() => inputElement.click()}>Selecciona el archivo</button>
        <input type="file"
          ref={input => inputElement = input} hidden
          onChange={e => {
            readFile(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
