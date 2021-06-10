import vcf from "vcf";
// Dynamically import VCF sample file
const getVcfSample = () => import("./contactos.vcf");
// Dynamically import contacts from JS
const getContacts = () => import("./contacts");

async function loadExample() {
  let vCards = [];
  let loadedFrom;
  try {
    const vcfSample = await getVcfSample();
    vCards = vcf.parse(vcfSample.default);
    loadedFrom = "Loaded contacts from vCard";
  } catch(err) {
    console.log(err);
    // Failed to load vCard
    // Create contacts from JS
    const contacts = await getContacts();
    contacts.default.map(contact => {
      let info = new vcf();
      info.set("fn", contact.fn);
      info.set("photo", contact.photo);
      info.set("n", contact.n);
      info.set("tel", contact.number);
      vCards.push(info);
    });
    loadedFrom = "Loaded contacts from JS";
  }
  console.log(loadedFrom);
  return vCards;
};

const loadDefaultContacts = () => {
  let vCards;
  // Try to fetch contacts from local storage.
  if (typeof(Storage) !== "undefined") {
    const vcfContacts = localStorage.getItem("contacts");
    if (vcfContacts) {
      if (vcfContacts === "empty") {
        // The user explicitly removed all the contacts.
        return null;
      }
      vCards = vcf.parse(vcfContacts);
      console.log("Loaded contacts from localStorage");
    }
  }

  return new Promise(resolve => {
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