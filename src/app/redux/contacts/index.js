import dustin from "./dustin.jpg";
import eli from "./eli.jpg";
import ryan from "./ryan.jpg";
import jennifer from "./jennifer.jpg";
import paul from "./paul.jpg";

const contacts = [
  {
    fn: "Dustin Smith",
    n: "Smith;Dustin;;;",
    photo: dustin,
    number: "04263994280"
  },
  {
    fn: "Eli Williams",
    n: "Willims;Eli;;;",
    photo: eli,
    number: "04148826636"
  },
  {
    fn: "Jennifer Friedman",
    n: "Friedman;Jennifer;;;",
    photo: jennifer,
    number: "04125786410"
  },
  {
    fn: "Paul Graham",
    n: "Graham;Paul;;;",
    photo: paul,
    number: "04249069351"
  },
  {
    fn: "Ryan Jhonson",
    n: "Jhonson;Ryan;;;",
    photo: ryan,
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