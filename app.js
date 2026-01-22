const countryList = {
  usd: "US",
  inr: "IN",
  eur: "EU",
  gbp: "GB",
  jpy: "JP",
  aud: "AU",
  cad: "CA",
};

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode.toUpperCase();
    newOption.value = currCode;
    if (select.name === "from" && currCode === "usd") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "inr") {
      newOption.selected = true;
    }
    select.appendChild(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag image based on selected currency
function updateFlag(element) {
  let currCode = element.value.toLowerCase();
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Fetch and update the exchange rate
async function updateExchangeRate() {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = 1;
  }

  try {
    const url = `https://api.exchangerate-api.com/v4/latest/${fromCurr.value.toUpperCase()}`;
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }
    let data = await response.json();

    let rate = data.rates[toCurr.value.toUpperCase()];
    if (!rate) {
      msg.style.color = "red";
      msg.innerText = `Exchange rate for ${fromCurr.value.toUpperCase()} to ${toCurr.value.toUpperCase()} not available`;
      return;
    }

    let finalAmount = amtVal * rate;
    msg.style.color = "#0066ff";
    msg.innerText = `${amtVal} ${fromCurr.value.toUpperCase()} = ${finalAmount.toFixed(4)} ${toCurr.value.toUpperCase()}`;
  } catch (error) {
    msg.style.color = "red";
    msg.innerText = `Error fetching exchange rate: ${error.message}`;
  }
}

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
