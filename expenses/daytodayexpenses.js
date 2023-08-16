const btndownload = document.getElementById("download");
const table = document.getElementById("table");
const ispremium = localStorage.getItem("pro");

if (!ispremium) {
  btndownload.disabled = true;
}

function showTable(obj) {
  const tr = document.createElement("tr");
  const dateTh = document.createElement("th");
  const descriptionTh = document.createElement("th");
  const categoryTh = document.createElement("th");
  const incomeTh = document.createElement("th");
  const expenseTh = document.createElement("th");
  dateTh.textContent = obj.date;
  descriptionTh.textContent = obj.description;
  categoryTh.textContent = obj.category;
  incomeTh.textContent = obj.income;
  expenseTh.textContent = obj.expense;
  tr.appendChild(dateTh);
  tr.appendChild(descriptionTh);
  tr.appendChild(categotyTh);
  tr.appendChild(incomeTh);
  tr.appendChild(expenseTh);
  table.appendChild(tr);
}
