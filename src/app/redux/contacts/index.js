import bender from "./bender.jpg";
import cristiano from "./cristiano.jpg";
import elon from "./elon.jpg";
import luis from "./luis.jpg";
import vladimir from "./vladimir.jpg";

const contacts = [
  {
    fn: "Bender Rodríguez",
    n: "Rodríguez;Bender;;;",
    photo: bender,
    number: "04263994280"
  },
  {
    fn: "Cristiano",
    n: ";Cristiano;;;",
    photo: cristiano,
    number: "04148826636"
  },
  {
    fn: "Elon Musk",
    n: "Musk;Elon;;;",
    photo: elon,
    number: "04125786410"
  },
  {
    fn: "Luis Villegas",
    n: "Villegas;Luis;;;",
    photo: luis,
    number: "04249069351"
  },
  {
    fn: "Vladimir Putin",
    n: "Putin;Vladimir;;;",
    photo: vladimir,
    number: "04128799802"
  },
];

contacts.forEach(contact => {
  let reader = new FileReader();
  reader.onloadend = () => {
    contact.photo = reader.result;
  }

  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");

  let img = new Image();
  img.onload = function() {
    c.width = this.naturalWidth;   // update canvas size to match image
    c.height = this.naturalHeight;
    ctx.drawImage(this, 0, 0);     // draw in image
    c.toBlob(blob => {             // get content as JPEG blob
      reader.readAsDataURL(blob);
    }, "image/jpeg", 0.75);
  };
  img.src = contact.photo;
});

export default contacts;