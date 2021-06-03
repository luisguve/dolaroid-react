import React, { useState } from "react";
import { icons } from "../../assets";
import { useToasts } from "react-toast-notifications";
import vcf from "vcf";
// Redux
import { useDispatch } from "react-redux";
import { loadContacts } from "../redux/actions";

const Modal = props => {
  const dispatch = useDispatch();
  const dragText = "Arrastra el archivo aquí";
  const releaseText = "Suelta el archivo para subirlo";
  const [ headerText, setHeaderText ] = useState(dragText);
  const [ dragAreaClass, setDragAreaClass ] = useState("drag-area");
  const { addToast } = useToasts();

  const handleFileContents = data => {
    let vCard;
    try {
      vCard = vcf.parse(data);
    } catch (err) {
      console.log("Invalid vcard:", err);
      addToast('archivo vCard inválido', { appearance: 'error' });
    }
    if (vCard) {
      dispatch(loadContacts(vCard));
      props.hide();
    }
  };

  const readFile = file => {
    if (file.type !== "text/x-vcard") {
      addToast('Selecciona un archivo .VCF', { appearance: 'error' });
      setHeaderText(dragText);
      setDragAreaClass("drag-area");
      return;
    }
    let reader = new FileReader();
    reader.onload = () => {
      handleFileContents(reader.result);
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
        <header className="text-center">{headerText}</header>
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

export default Modal;
