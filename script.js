let items = [];
let orderId = '';

function fetchItems() {
  fetch('data/items.json')
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
    data: items.map(item => ({ id: item.name, text: item.name })),
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
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `ORD-${year}${month}${day}-${now.getTime()}`;
}

function saveOrder() {
  const customerName = document.getElementById("customer-name").value;
  const description = document.getElementById("order-description").value;
  const order = [];
  
  document.querySelectorAll(".item-row").forEach(function (row) {
    const itemName = row.querySelector(".item-name").value;
    const quantity = row.querySelector(".item-quantity").value;
    const itemPrice = items.find(item => item.name === itemName)?.price || 0;
    const totalPrice = itemPrice * quantity;
    
    if (itemName && quantity) {
      order.push({
        name: itemName,
        quantity: quantity,
        price: itemPrice,
        totalPrice: totalPrice
      });
    }
  });

  const orderId = generateOrderId();
  const orderData = {
    id: orderId,
    customerName,
    description,
    items: order
  };

  // Save order data to a file or server (Here it's just logging to console for demonstration)
  console.log("Order Saved:", orderData);

  alert(`Order ID: ${orderId}`);
}

document.getElementById("add-item-btn").addEventListener("click", addItemRow);
document.getElementById("save-order-btn").addEventListener("click", saveOrder);

document.addEventListener("DOMContentLoaded", function () {
  fetchItems();
});
