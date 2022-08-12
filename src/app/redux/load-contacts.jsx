import vcf from "vcf";
import file from "./contactos.vcf";

async function loadExample() {

  try {

    return vcf.parse(file);

  } catch (err) {

    console.log("Invalid vcard:", err);
    return [];

  }

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