const validatePhoneFocus = number => {
  if (!number) return {
    label: "Teléfono:",
    valid: true
  };
  // Does the phone number have just numbers?
  if (/\D/.test(number)) {
    return {
      label: "El teléfono debe contener solo dígitos",
      valid: false
    };
  }
  switch(number.length) {
  case 1:
    // Does the phone number start with 0?
    if (!/^0/.test(number)) {
      return {
        label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
        valid: false
      };
    }
    break;
  case 2:
    // Does the phone number start with 04?
    if (!/^04/.test(number)) {
      return {
        label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
        valid: false
      };
    }
    break;
  case 3:
    // Does the phone number start with 04[1|2]?
    if (!/^04[1|2]/.test(number)) {
      return {
        label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
        valid: false
      };
    }
    break;
  default:
    // Does the phone number start with 04 [1|2] [2|4|6]?
    if (!/^04[1|2][2|4|6]/.test(number)) {
      return {
        label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
        valid: false
      };
    }
    // Does the phone number have more than 11 characters?
    if (number.length > 11) {
      return {
        label: "El teléfono debe contener 11 dígitos",
        valid: false
      };
    }
  }
  return {
    label: "Teléfono:",
    valid: true
  };
};

const validatePhoneBlur = number => {
  // Does the phone number have just numbers?
  if (/\D/.test(number)) {
    return {
      label: "El teléfono debe contener solo dígitos",
      valid: false
    };
  }
  // Does the phone number start with 04[1|2][2|4|6]?
  if (!/^04[1|2][2|4|6]/.test(number)) {
    return {
      label: "El teléfono debe comenzar con 04(12/14/24/16/26)",
      valid: false
    };
  }
  // Does the phone number have more than 11 characters?
  if (number.length != 11) {
    return {
      label: "El teléfono debe contener 11 dígitos",
      valid: false
    };
  }
  return {
    label: "Teléfono:",
    valid: true
  };
}

export { validatePhoneFocus, validatePhoneBlur };
