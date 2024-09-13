window.onload = function () {
  fetchItems();
  initEventListeners();
  document.getElementById("add-item-btn").addEventListener("click", addItemRow);
  document.getElementById("save-order-btn").addEventListener("click", saveOrder);
};

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
  .then(reg => console.log('Service Worker Registered:', reg))
  .catch(err => console.log('Service Worker Registration Failed:', err));
}

let items = [];
let orderId = '';

function fetchItems() {
  // Fetch items from your API or server
  fetch('fetch-items.js')
    .then(response => response.json())
    .then(data => {
      items = data;
      populateDropdowns();
    });
}

function populateDropdowns() {
  $(".item-name").select2({
    placeholder: "Select an item",
    allowClear: true,
    data: items.map(item => ({ id: item.name, text: item.name }))
  }).on("change", autoCalculate);
}

function autoCalculate() {
  let total = 0;
  document.querySelectorAll(".item-row").forEach(function (row) {
    const selectedItem = row.querySelector(".item-name").value;
    const quantity = row.querySelector(".item-quantity").value;
    const priceElement = row.querySelector(".item-price");

    if (selectedItem && quantity) {
      const price = items.find(item => item.name === selectedItem)?.price || 0;
      const itemTotal = price * quantity;
      total += itemTotal;
      priceElement.innerText = `Rp ${itemTotal.toLocaleString()}`;
    } else {
      priceElement.innerText = '';
    }
  });
  document.getElementById("total").innerText = "Total Price: Rp " + total.toLocaleString();
}

function addItemRow() {
  const container = document.getElementById("item-container");

  const newItemRow = document.createElement("div");
  newItemRow.classList.add("item-row");

  newItemRow.innerHTML = `
    <select class="item-name">
      <option value="">Select an item</option>
      ${items.map(item => `<option value="${item.name}">${item.name}</option>`).join('')}
    </select>
    <input type="number" class="item-quantity" value="1" min="1" />
    <span class="item-price"></span>
    <button class="remove-btn" onclick="removeItemRow(this)">Remove</button>
  `;

  container.appendChild(newItemRow);
  initSelect2();
  initEventListeners();
}

function removeItemRow(button) {
  button.parentElement.remove();
  autoCalculate();
}

function initSelect2() {
  $(".item-name").select2({
    placeholder: "Select an item",
    allowClear: true,
  }).on("change", autoCalculate);
}

function initEventListeners() {
  document.querySelectorAll(".item-quantity").forEach(function (input) {
    input.addEventListener("input", autoCalculate);
  });
}

function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getTime()).slice(-4);
  return `${year}${month}${day}-${time}`;
}

function saveOrder() {
  const customerName = document.getElementById("customer-name").value;
  const description = document.getElementById("order-description").value;
  const items = [];

  document.querySelectorAll(".item-row").forEach(row => {
    const itemName = row.querySelector(".item-name").value;
    const quantity = row.querySelector(".item-quantity").value;
    if (itemName && quantity) {
      items.push({ itemName, quantity });
    }
  });

  if (items.length === 0 || !customerName) {
    alert("Please add at least one item and enter the customer name.");
    return;
  }

  const order = {
    orderId: generateOrderId(),
    customerName,
    description,
    items
  };

  fetch('save-order.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
  .then(response => response.json())
  .then(result => {
    alert("Order saved successfully! Order ID: " + result.orderId);
    // Optionally clear the form or reset state
  })
  .catch(error => console.error("Error saving order:", error));
}
