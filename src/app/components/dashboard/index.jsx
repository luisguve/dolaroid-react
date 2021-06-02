import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { listBackgrounds, changeBackground } from "../../redux/actions";
// Internal components
import BackgroundChooser from "./background-chooser";
import ListContacts from "./list-contacts";
import SearchBar from "./search-contacts";

const Dashboard = props => {
  const settings = useSelector(state => state.settings);
  const contacts = useSelector(state => state.contacts.contactsToList);
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
        <React.Fragment>
          <SearchBar />
          {/* Contacts to list */}
          <div className="results ps-2 ps-md-4 pe-0 pe-md-4 me-2">
            <ListContacts contacts={contacts} />
          </div>
        </React.Fragment>
      }
    </main>
  );
};

export default Dashboard;
