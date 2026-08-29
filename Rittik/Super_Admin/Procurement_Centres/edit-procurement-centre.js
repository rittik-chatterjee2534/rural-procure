const defaultCentres = [
  {
    code: "PS-01",
    name: "Krishnanagar Centre",
    state: "west-bengal",
    district: "nadia",
    officerId: "OFF-101",
    capacity: 100,
    status: "active",
    address: "Krishnanagar, Nadia",
    pincode: "741101",
    openingTime: "09:00",
    closingTime: "17:00",
  },
  {
    code: "PS-02",
    name: "Bardhaman Centre",
    state: "west-bengal",
    district: "bardhaman",
    officerId: "OFF-102",
    capacity: 80,
    status: "active",
    address: "Bardhaman, West Bengal",
    pincode: "713101",
    openingTime: "09:00",
    closingTime: "17:00",
  },
  {
    code: "PS-03",
    name: "Malda Centre",
    state: "west-bengal",
    district: "malda",
    officerId: "OFF-103",
    capacity: 120,
    status: "active",
    address: "Malda, West Bengal",
    pincode: "732101",
    openingTime: "09:00",
    closingTime: "17:00",
  },
  {
    code: "PS-04",
    name: "Murshidabad Centre",
    state: "west-bengal",
    district: "murshidabad",
    officerId: "OFF-104",
    capacity: 90,
    status: "active",
    address: "Berhampore, Murshidabad",
    pincode: "742101",
    openingTime: "09:00",
    closingTime: "17:00",
  },
  {
    code: "PS-05",
    name: "Jalpaiguri Centre",
    state: "west-bengal",
    district: "jalpaiguri",
    officerId: "OFF-105",
    capacity: 110,
    status: "active",
    address: "Jalpaiguri, West Bengal",
    pincode: "735101",
    openingTime: "09:00",
    closingTime: "17:00",
  },
  {
    code: "PS-06",
    name: "Cooch Behar Centre",
    state: "west-bengal",
    district: "cooch-behar",
    officerId: "OFF-106",
    capacity: 70,
    status: "active",
    address: "Cooch Behar, West Bengal",
    pincode: "736101",
    openingTime: "09:00",
    closingTime: "17:00",
  },
  {
    code: "PS-07",
    name: "Purulia Centre",
    state: "west-bengal",
    district: "purulia",
    officerId: "OFF-107",
    capacity: 60,
    status: "inactive",
    address: "Purulia, West Bengal",
    pincode: "723101",
    openingTime: "09:00",
    closingTime: "17:00",
  },
  {
    code: "PS-08",
    name: "Birbhum Centre",
    state: "west-bengal",
    district: "birbhum",
    officerId: "OFF-108",
    capacity: 80,
    status: "active",
    address: "Suri, Birbhum",
    pincode: "731101",
    openingTime: "09:00",
    closingTime: "17:00",
  },
];

const editCentreForm =
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

const saveButton =
  document.querySelector(".save-centre-button");

function getSavedCentres() {
  try {
    const savedData = localStorage.getItem(
      "ruralProcureCentres",
    );

    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error("Could not load saved centres:", error);
    return [];
  }
}

function getSelectedCentre() {
  const parameters =
    new URLSearchParams(window.location.search);

  const selectedCode = parameters.get("id");

  const defaultCentre = defaultCentres.find((centre) => {
    return centre.code === selectedCode;
  });

  const savedCentre = getSavedCentres().find((centre) => {
    return centre.code === selectedCode;
  });

  if (defaultCentre && savedCentre) {
    return {
      ...defaultCentre,
      ...savedCentre,
    };
  }

  return savedCentre || defaultCentre;
}

const selectedCentre = getSelectedCentre();

function loadEditForm() {
  if (!selectedCentre) {
    formMessage.textContent =
      "The selected procurement centre could not be found.";

    formMessage.classList.add("error");

    saveButton.disabled = true;
    return;
  }

  document.title =
    `Edit ${selectedCentre.name} | RuralProcure`;

  centreNameInput.value = selectedCentre.name;
  centreCodeInput.value = selectedCentre.code;
  dailyCapacityInput.value = selectedCentre.capacity;
  centreStatusInput.value = selectedCentre.status;
  centreAddressInput.value =
    selectedCentre.address || selectedCentre.location || "";

  stateInput.value = selectedCentre.state;
  districtInput.value = selectedCentre.district;
  pincodeInput.value = selectedCentre.pincode || "";
  officerInput.value = selectedCentre.officerId || "";
  openingTimeInput.value =
    selectedCentre.openingTime || "09:00";

  closingTimeInput.value =
    selectedCentre.closingTime || "17:00";

  /*
    The centre code acts as the permanent identifier,
    so users should not change it while editing.
  */

  centreCodeInput.readOnly = true;
}

loadEditForm();

/* Validation helpers */

function showFieldError(input, errorId, message) {
  input.classList.add("is-invalid");
  document.getElementById(errorId).textContent = message;
}

function clearFieldError(input, errorId) {
  input.classList.remove("is-invalid");
  document.getElementById(errorId).textContent = "";
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

function validateEditForm() {
  let formIsValid = true;

  const centreName = centreNameInput.value.trim();
  const capacity = Number(dailyCapacityInput.value);
  const address = centreAddressInput.value.trim();
  const pincode = pincodeInput.value.trim();

  if (centreName.length < 3) {
    showFieldError(
      centreNameInput,
      "centre-name-error",
      "Centre name must contain at least 3 characters.",
    );

    formIsValid = false;
  } else {
    clearFieldError(
      centreNameInput,
      "centre-name-error",
    );
  }

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

    formIsValid = false;
  } else {
    clearFieldError(
      dailyCapacityInput,
      "capacity-error",
    );
  }

  if (
    !validateRequiredSelect(
      centreStatusInput,
      "status-error",
      "Select an operational status.",
    )
  ) {
    formIsValid = false;
  }

  if (address.length < 10) {
    showFieldError(
      centreAddressInput,
      "address-error",
      "Enter a complete address.",
    );

    formIsValid = false;
  } else {
    clearFieldError(
      centreAddressInput,
      "address-error",
    );
  }

  if (
    !validateRequiredSelect(
      stateInput,
      "state-error",
      "Select a state.",
    )
  ) {
    formIsValid = false;
  }

  if (
    !validateRequiredSelect(
      districtInput,
      "district-error",
      "Select a district.",
    )
  ) {
    formIsValid = false;
  }

  if (!/^[0-9]{6}$/.test(pincode)) {
    showFieldError(
      pincodeInput,
      "pincode-error",
      "Enter a valid 6-digit PIN code.",
    );

    formIsValid = false;
  } else {
    clearFieldError(
      pincodeInput,
      "pincode-error",
    );
  }

  if (
    !validateRequiredSelect(
      officerInput,
      "officer-error",
      "Select an officer.",
    )
  ) {
    formIsValid = false;
  }

  if (openingTimeInput.value === "") {
    showFieldError(
      openingTimeInput,
      "opening-time-error",
      "Opening time is required.",
    );

    formIsValid = false;
  } else {
    clearFieldError(
      openingTimeInput,
      "opening-time-error",
    );
  }

  if (closingTimeInput.value === "") {
    showFieldError(
      closingTimeInput,
      "closing-time-error",
      "Closing time is required.",
    );

    formIsValid = false;
  } else if (
    closingTimeInput.value <= openingTimeInput.value
  ) {
    showFieldError(
      closingTimeInput,
      "closing-time-error",
      "Closing time must be later than opening time.",
    );

    formIsValid = false;
  } else {
    clearFieldError(
      closingTimeInput,
      "closing-time-error",
    );
  }

  return formIsValid;
}

/* PIN code accepts numbers only */

pincodeInput.addEventListener("input", () => {
  pincodeInput.value =
    pincodeInput.value.replace(/\D/g, "");

  clearFieldError(
    pincodeInput,
    "pincode-error",
  );
});

/* Save edited centre */

editCentreForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formMessage.textContent = "";
  formMessage.className = "form-message";

  if (!selectedCentre) {
    return;
  }

  if (!validateEditForm()) {
    formMessage.textContent =
      "Please correct the highlighted fields.";

    formMessage.classList.add("error");

    editCentreForm
      .querySelector(".is-invalid")
      ?.focus();

    return;
  }

  const stateName =
    stateInput.selectedOptions[0].textContent;

  const districtName =
    districtInput.selectedOptions[0].textContent;

  const officerName =
    officerInput.selectedOptions[0].textContent
      .split("—")[0]
      .trim();

  const updatedCentre = {
    ...selectedCentre,
    code: centreCodeInput.value.trim(),
    name: centreNameInput.value.trim(),
    capacity: Number(dailyCapacityInput.value),
    status: centreStatusInput.value,
    address: centreAddressInput.value.trim(),
    state: stateInput.value,
    stateName,
    district: districtInput.value,
    districtName,
    location: `${districtName}, ${stateName}`,
    pincode: pincodeInput.value.trim(),
    officerId: officerInput.value,
    officer: officerName,
    openingTime: openingTimeInput.value,
    closingTime: closingTimeInput.value,
  };

  const savedCentres = getSavedCentres();

  const savedCentreIndex = savedCentres.findIndex(
    (centre) => {
      return centre.code === updatedCentre.code;
    },
  );

  if (savedCentreIndex >= 0) {
    savedCentres[savedCentreIndex] = updatedCentre;
  } else {
    savedCentres.push(updatedCentre);
  }

  localStorage.setItem(
    "ruralProcureCentres",
    JSON.stringify(savedCentres),
  );

  formMessage.textContent =
    "Centre information updated successfully.";

  formMessage.classList.add("success");

  saveButton.disabled = true;

  setTimeout(() => {
    window.location.href =
      `./procurement-centre-details.html?id=${encodeURIComponent(
        updatedCentre.code,
      )}`;
  }, 900);
});