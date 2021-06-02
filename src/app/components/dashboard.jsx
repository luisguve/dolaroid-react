import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { searchContact, listBackgrounds, changeBackground } from "../redux/actions";
import Contact from "./contact";
// Background images
import { imgs } from "../../assets";

const Dashboard = props => {
  const settings = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const getBackground = () => {
    const defaultBg = `linear-gradient(141deg, #fff3f3 0%, #e1faff 100%)`;
    const defaultBgConfig = " center center / cover no-repeat";
    if (settings.listBackgrounds) return defaultBg.concat(defaultBgConfig);
    return settings.currentBackground.url.concat(defaultBgConfig);
  };

  const defaultConfig = () => (
    {
      style: {
        background: getBackground()
      },
      inPreview: false
    }
  );

  const [config, setConfig] = useState(defaultConfig());

  useEffect(() => {
    setConfig(defaultConfig());
  }, [settings]);

  // Preview background.
  // Do not change background in the store when previewing it.
  // Instead, change it locally.
  const switchPreview = bg => {
    if (config.inPreview) {
      setConfig(defaultConfig());
      return;
    }
    setConfig({
      style: {
        background: `${bg} center center / cover no-repeat`
      },
      inPreview: true
    });
  };
  const cancel = () => {
    dispatch(listBackgrounds());
  };
  const updateBackground = bg => {
    dispatch(changeBackground({
      url: `url(${bg.url})`,
      id: bg.id
    }));
    addToast("Fondo de pantalla cambiado", {appearance: "success"});
  };

  return (
    <main style={config.style} className="h-100 d-flex flex-column">
      {
        settings.listBackgrounds ?
        <BackgroundChooser
          switchPreview={switchPreview}
          inPreview={config.inPreview}
          cancel={cancel}
          updateBackground={updateBackground}
        />
        :
        <Contacts />
      }
    </main>
  );
};

const BackgroundChooser = props => {
  const currBgId = useSelector(state => state.settings.currentBackground.id);
  const [bgId, setBgId] = useState(currBgId);
  const previewBackground = () => {
    props.switchPreview("url("+imgs[bgId].url+")");
  };
  const cancel = () => {
    props.cancel()
  };
  const accept = () => {
    props.updateBackground({
      url: imgs[bgId].url,
      id: bgId
    });
  };
  let options = [];
  for (const id in imgs) {
    let checked = "";
    if (bgId == id) {
      checked = "checked";
    }
    options.push(
      <label className="col-6 col-md-4 px-0" key={id}>
        <input type="radio" checked={checked} value={id} name="background"
         onChange={e => setBgId(e.target.value)}/>
        <div className="content p-2">
          <img className="img-fluid sample" src={imgs[id].url} alt={imgs[id].name} />
          <p className="text-center m-0 pt-1"><em>{imgs[id].name}</em></p>
        </div>
      </label>
    );
  }
  return (
    <div className="background-chooser px-3 d-flex flex-column">
      {
      !props.inPreview &&
      <React.Fragment>
        <h1 className="col-12 text-secondary fs-4 fw-bold text-center my-3">
          Cambiar fondo de pantalla
        </h1>
        <div className="row mx-0 options">{options}</div>
      </React.Fragment>
      }
      <div className="py-2 d-flex justify-content-center">
        <button className="mx-2 btn btn-info" onClick={previewBackground}>
          {!props.inPreview ? "Vista previa" : "Volver"}
        </button>
        <button className="mx-2 btn btn-secondary" onClick={cancel}>
          Cancelar
        </button>
        <button className="mx-2 btn btn-primary" onClick={accept}>
          Aceptar
        </button>
      </div>
    </div>
  );
};

const Contacts = props => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.contactsToList);

  const handleChangeSearch = e => {
    if (contacts == null) {
      return;
    }
    const query = e.target.value;
    dispatch(searchContact(query));
  };

  return (
    <React.Fragment>
      {/* Search bar */}
      <div className="d-flex align-items-center search px-2 px-md-4">
        <span className="ps-md-2 pe-md-4 w-100">
          <input
            className="form-control"
            type="search"
            placeholder="Buscar contacto"
            aria-label="Buscar contacto"
            onChange={handleChangeSearch}
          />
        </span>
      </div>
      {/* Contacts to list */}
      <div className="results ps-2 ps-md-4 pe-0 pe-md-4 me-2">
        <Results contacts={contacts} />
      </div>
    </React.Fragment>
  );
};

const Results = props => {
  let results = (
    <div className="d-flex w-100 justify-content-center align-items-center">
      <div className="p-3 no-contacts">
        <h1 className="fs-2">Carga un archivo vCard o crea contactos</h1>
        <p className="text-center fw-bold fs-6">Tus contactos aparecerán aquí</p>
      </div>
    </div>
  );

  if (props.contacts != null) {
    if (!props.contacts.length) {
      results = (
        <div className="d-flex h-25 w-100 justify-content-center align-items-center">
          <div className="p-3 no-contacts">
            <h1 className="fs-2">No se encontraron contactos</h1>
          </div>
        </div>
      );
    } else {
      let contactsToList = props.contacts.map((vCard, idx) => {
        return <Contact key={idx} idx={idx} vCard={vCard} />
      });
      results = (
        <div className="d-flex flex-wrap row mx-0">
          {contactsToList}
        </div>
      )
    }
  }
  return (<React.Fragment>{results}</React.Fragment>);
};

export default Dashboard;
