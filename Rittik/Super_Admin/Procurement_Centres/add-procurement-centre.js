const addCentreForm =
  document.getElementById("add-centre-form");

const centreNameInput =
  document.getElementById("centre-name-input");

const centreCodeInput =
  document.getElementById("centre-code-input");

const dailyCapacityInput =
  document.getElementById("daily-capacity-input");

const centreStatusInput =
  document.getElementById("centre-status-input");

const centreAddressInput =
  document.getElementById("centre-address-input");

const stateInput =
  document.getElementById("state-input");

const districtInput =
  document.getElementById("district-input");

const pincodeInput =
  document.getElementById("pincode-input");

const officerInput =
  document.getElementById("officer-input");

const openingTimeInput =
  document.getElementById("opening-time-input");

const closingTimeInput =
  document.getElementById("closing-time-input");

const formMessage =
  document.getElementById("form-message");

const saveCentreButton =
  document.querySelector(".save-centre-button");

const existingCentreCodes = [
  "PS-01",
  "PS-02",
  "PS-03",
  "PS-04",
  "PS-05",
  "PS-06",
  "PS-07",
  "PS-08",
];

/* Error helpers */

function showFieldError(input, errorId, message) {
  input.classList.add("is-invalid");

  document.getElementById(errorId).textContent =
    message;
}

function clearFieldError(input, errorId) {
  input.classList.remove("is-invalid");

  document.getElementById(errorId).textContent = "";
}

function getSavedCentres() {
  try {
    return JSON.parse(
      localStorage.getItem("ruralProcureCentres"),
    ) || [];
  } catch (error) {
    return [];
  }
}

/* Individual validations */

function validateCentreName() {
  const name = centreNameInput.value.trim();

  if (name === "") {
    showFieldError(
      centreNameInput,
      "centre-name-error",
      "Centre name is required.",
    );

    return false;
  }

  if (name.length < 3) {
    showFieldError(
      centreNameInput,
      "centre-name-error",
      "Centre name must contain at least 3 characters.",
    );

    return false;
  }

  clearFieldError(
    centreNameInput,
    "centre-name-error",
  );

  return true;
}

function validateCentreCode() {
  const code = centreCodeInput.value
    .trim()
    .toUpperCase();

  centreCodeInput.value = code;

  if (!/^PS-[0-9]{2}$/.test(code)) {
    showFieldError(
      centreCodeInput,
      "centre-code-error",
      "Use the format PS-09.",
    );

    return false;
  }

  const savedCentres = getSavedCentres();

  const codeAlreadyExists =
    existingCentreCodes.includes(code) ||
    savedCentres.some((centre) => {
      return centre.code === code;
    });

  if (codeAlreadyExists) {
    showFieldError(
      centreCodeInput,
      "centre-code-error",
      "This centre code already exists.",
    );

    return false;
  }

  clearFieldError(
    centreCodeInput,
    "centre-code-error",
  );

  return true;
}

function validateCapacity() {
  const capacity = Number(dailyCapacityInput.value);

  if (
    dailyCapacityInput.value === "" ||
    capacity < 1 ||
    capacity > 1000
  ) {
    showFieldError(
      dailyCapacityInput,
      "capacity-error",
      "Capacity must be between 1 and 1000.",
    );

    return false;
  }

  clearFieldError(
    dailyCapacityInput,
    "capacity-error",
  );

  return true;
}

function validateRequiredSelect(
  input,
  errorId,
  message,
) {
  if (input.value === "") {
    showFieldError(input, errorId, message);
    return false;
  }

  clearFieldError(input, errorId);
  return true;
}

function validateAddress() {
  const address = centreAddressInput.value.trim();

  if (address.length < 10) {
    showFieldError(
      centreAddressInput,
      "address-error",
      "Enter a complete address of at least 10 characters.",
    );

    return false;
  }

  clearFieldError(
    centreAddressInput,
    "address-error",
  );

  return true;
}

function validatePincode() {
  const pincode = pincodeInput.value.trim();

  if (!/^[0-9]{6}$/.test(pincode)) {
    showFieldError(
      pincodeInput,
      "pincode-error",
      "Enter a valid 6-digit PIN code.",
    );

    return false;
  }

  clearFieldError(pincodeInput, "pincode-error");

  return true;
}

function validateOperatingTimes() {
  clearFieldError(
    openingTimeInput,
    "opening-time-error",
  );

  clearFieldError(
    closingTimeInput,
    "closing-time-error",
  );

  if (openingTimeInput.value === "") {
    showFieldError(
      openingTimeInput,
      "opening-time-error",
      "Opening time is required.",
    );

    return false;
  }

  if (closingTimeInput.value === "") {
    showFieldError(
      closingTimeInput,
      "closing-time-error",
      "Closing time is required.",
    );

    return false;
  }

  if (
    closingTimeInput.value <= openingTimeInput.value
  ) {
    showFieldError(
      closingTimeInput,
      "closing-time-error",
      "Closing time must be later than opening time.",
    );

    return false;
  }

  return true;
}

/* Validate complete form */

function validateForm() {
  const nameIsValid = validateCentreName();
  const codeIsValid = validateCentreCode();
  const capacityIsValid = validateCapacity();

  const statusIsValid = validateRequiredSelect(
    centreStatusInput,
    "status-error",
    "Select an operational status.",
  );

  const addressIsValid = validateAddress();

  const stateIsValid = validateRequiredSelect(
    stateInput,
    "state-error",
    "Select a state.",
  );

  const districtIsValid = validateRequiredSelect(
    districtInput,
    "district-error",
    "Select a district.",
  );

  const pincodeIsValid = validatePincode();

  const officerIsValid = validateRequiredSelect(
    officerInput,
    "officer-error",
    "Select an officer.",
  );

  const timesAreValid = validateOperatingTimes();

  return (
    nameIsValid &&
    codeIsValid &&
    capacityIsValid &&
    statusIsValid &&
    addressIsValid &&
    stateIsValid &&
    districtIsValid &&
    pincodeIsValid &&
    officerIsValid &&
    timesAreValid
  );
}

/* Format centre code automatically */

centreCodeInput.addEventListener("input", () => {
  centreCodeInput.value =
    centreCodeInput.value.toUpperCase();

  clearFieldError(
    centreCodeInput,
    "centre-code-error",
  );
});

/* Allow only numbers in PIN code */

pincodeInput.addEventListener("input", () => {
  pincodeInput.value =
    pincodeInput.value.replace(/\D/g, "");

  clearFieldError(pincodeInput, "pincode-error");
});

/* Clear errors while editing */

centreNameInput.addEventListener("input", () => {
  clearFieldError(
    centreNameInput,
    "centre-name-error",
  );
});

dailyCapacityInput.addEventListener("input", () => {
  clearFieldError(
    dailyCapacityInput,
    "capacity-error",
  );
});

centreAddressInput.addEventListener("input", () => {
  clearFieldError(
    centreAddressInput,
    "address-error",
  );
});

centreStatusInput.addEventListener("change", () => {
  clearFieldError(
    centreStatusInput,
    "status-error",
  );
});

stateInput.addEventListener("change", () => {
  clearFieldError(stateInput, "state-error");
});

districtInput.addEventListener("change", () => {
  clearFieldError(
    districtInput,
    "district-error",
  );
});

officerInput.addEventListener("change", () => {
  clearFieldError(
    officerInput,
    "officer-error",
  );
});

openingTimeInput.addEventListener("change", () => {
  clearFieldError(
    openingTimeInput,
    "opening-time-error",
  );
});

closingTimeInput.addEventListener("change", () => {
  clearFieldError(
    closingTimeInput,
    "closing-time-error",
  );
});

/* Submit form */

addCentreForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formMessage.textContent = "";
  formMessage.className = "form-message";

  if (!validateForm()) {
    formMessage.textContent =
      "Please correct the highlighted fields.";

    formMessage.classList.add("error");

    const firstInvalidField =
      addCentreForm.querySelector(".is-invalid");

    firstInvalidField?.focus();

    return;
  }

  const officerName =
    officerInput.selectedOptions[0].textContent
      .split("—")[0]
      .trim();

  const stateName =
    stateInput.selectedOptions[0].textContent;

  const districtName =
    districtInput.selectedOptions[0].textContent;

  const newCentre = {
    code: centreCodeInput.value.trim(),
    name: centreNameInput.value.trim(),
    location: `${districtName}, ${stateName}`,
    address: centreAddressInput.value.trim(),
    state: stateInput.value,
    stateName,
    district: districtInput.value,
    districtName,
    pincode: pincodeInput.value.trim(),
    officer: officerName,
    officerId: officerInput.value,
    capacity: Number(dailyCapacityInput.value),
    bookings: 0,
    queue: 0,
    status: centreStatusInput.value,
    openingTime: openingTimeInput.value,
    closingTime: closingTimeInput.value,
  };

  const savedCentres = getSavedCentres();

  savedCentres.push(newCentre);

  localStorage.setItem(
    "ruralProcureCentres",
    JSON.stringify(savedCentres),
  );

  formMessage.textContent =
    `${newCentre.name} has been saved successfully.`;

  formMessage.classList.add("success");

  addCentreForm.reset();

  openingTimeInput.value = "09:00";
  closingTimeInput.value = "17:00";
});

