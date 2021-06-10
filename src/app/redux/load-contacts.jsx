import vcf from "vcf";
// Dynamically import contacts from JS
const getContacts = () => import("./contacts");

async function loadExample() {
  const vCards = [];
  // Get contacts as an array of JSON
  const contacts = await getContacts();
  // Create contacts from array of JSON
  contacts.default.map(contact => {
    let info = new vcf();
    info.set("fn", contact.fn);
    info.set("photo", contact.photo);
    info.set("n", contact.n);
    info.set("tel", contact.number);
    vCards.push(info);
  });
  console.log("Loaded contacts from JS");
  return vCards;
};

const loadDefaultContacts = () => {
  return new Promise(resolve => {
    let vCards;
    // Try to fetch contacts from local storage.
    if (typeof(Storage) !== "undefined") {
      const vcfContacts = localStorage.getItem("contacts");
      if (vcfContacts) {
        if (vcfContacts === "empty") {
          // The user explicitly removed all the contacts.
          resolve(null);
          return;
        }
        vCards = vcf.parse(vcfContacts);
        console.log("Loaded contacts from localStorage");
      }
    }
    if (!vCards) {
      loadExample().then(vCards => {
        resolve(vCards)
      });
      return;
    }
    resolve(vCards);
  });
};

export default loadDefaultContacts;

export { loadExample };