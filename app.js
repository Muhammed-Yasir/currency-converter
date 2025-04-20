
const API_KEY = "59565a8abe07add54f836cf9"; // ← Replace with your actual key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = parseFloat(amountInput.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;
  const URL = `${BASE_URL}/${from}`;

  console.log("🔄 Fetching from:", URL);

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error("API response not OK");

    const data = await response.json();
    const rate = data.conversion_rates[to];

    if (!rate) throw new Error("Rate not found");

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    console.error("❌ Error:", error);
    msg.innerText = "Something went wrong. Try again!";
  }
};

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
