import React from "react";
const getTrianglify = () => import("../assets/imgs/cool-background.png");

const Loader = props => {
  return(
    <div className="default-loader">
      <h1 className="p-5">{props.label}</h1>
    </div>
  );
};

const InlineLoader = props => {
  return (
    <div className="inline-loader">
      <h4 className="p-5">{props.label}</h4>
    </div>
  );
};

let defaultBg;

// Load background.
// Because the background is gonna be imported dynamically,
// the function will be awaiting for the background.
(async () => {
  // Try to load settings from localStorage if available
  if (typeof(Storage) !== "undefined") {
    const defaultSettings = JSON.parse(localStorage.getItem("settings"));
    if (defaultSettings) {
      defaultBg = defaultSettings.currentBackground.url;
    }
  }
  if (!defaultBg) {
    const bg = await getTrianglify();
    defaultBg = `url(${bg.default})`;
  }
})();

const style = {
  background: defaultBg,
  backgroundSize: "cover",
  backgrundPosition: "center"
};

const StyledInlineLoader = props => {
  return (
    <div className="inline-loader" style={style}>
      <h4 className="p-5">{props.label}</h4>
    </div>
  );
};

export default Loader;

export {
  InlineLoader,
  StyledInlineLoader
};
