import * as icons from "../../assets/icons";
import React from "react";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../redux/actions";
// Package for reading VCF text.
import vcf from "vcf";

const Navbar = props => {
  let contacts = useSelector(state => state.contacts);
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
  let downloadClass = "icon";
  if (!contacts.length) {
    downloadClass += " disabled";
  }
  return (
    <div className="container" id="nav-container">
      <nav className="d-flex justify-content-between py-3">
        <div className="d-flex">
          <img
            alt=""
            className="icon me-3"
            title="Subir al chivo"
            src={icons.vcf}
            onClick={() => setShowModal(true)} />
          <img
            alt=""
            title="Descargar al chivo"
            className={downloadClass}
            src={icons.download}
            onClick={handleDownload}
          />
        </div>
        <div></div>
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
        <span>O</span>
        <button onClick={() => inputElement.click()}>Selecciona el archivo</button>
        <input type="file"
          ref={input => inputElement = input } hidden
          onChange={e => {
            readFile(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
