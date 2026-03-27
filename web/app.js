const connectBtn = document.getElementById("connectBtn");
const grid = document.getElementById("grid");

let device;

// Create 12 buttons
for (let i = 1; i <= 12; i++) {
  const btn = document.createElement("div");
  btn.className = "button";
  btn.dataset.id = i;
  btn.innerText = i;
  grid.appendChild(btn);
}

connectBtn.onclick = async () => {
  try {
    const devices = await navigator.hid.requestDevice({
      filters: [
        { vendorId: 0xCafe } // <-- CHANGE THIS to your VID
      ]
    });

    if (devices.length === 0) return;

    device = devices[0];
    await device.open();

    console.log("Connected:", device.productName);

    device.addEventListener("inputreport", handleInput);
  } catch (err) {
    console.error(err);
  }
};

function handleInput(event) {
  const { data } = event;
  const bytes = new Uint8Array(data.buffer);

  console.log(bytes);

  // Example format:
  // bytes[0] = button id
  // bytes[1] = pressed (1/0)

  const id = bytes[0];
  const pressed = bytes[1];

  const el = document.querySelector(`.button[data-id='${id}']`);
  if (!el) return;

  if (pressed) {
    el.classList.add("active");
  } else {
    el.classList.remove("active");
  }
}