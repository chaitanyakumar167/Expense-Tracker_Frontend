const form = document.getElementById("addForm");
const itemList = document.getElementById("items");
// Get input values
const category = document.getElementById("category");
const amount = document.getElementById("amount");
const description = document.getElementById("description");

const btnBuyPremium = document.getElementById("rzp-button1");
const premium = document.getElementById("premium");
const btnLeaderBoard = document.getElementById("btn_leader_board");
const leaderBoardTitle = document.getElementById("leader_board_title");
const leaderBoardList = document.getElementById("leader_board_list");

const token = localStorage.getItem("token");

// Form submit event
form.addEventListener("submit", addItem);

// Add item
async function addItem(e) {
  e.preventDefault();

  let obj = {
    amount: amount.value,
    description: description.value,
    category: category.value,
  };

  await axios
    .post("http://localhost:4000/user/add-expense", obj, {
      headers: { Authorization: token },
    })
    .then((res) => (obj.id = res.data))
    .catch((err) => console.log(err));

  show(obj);
  amount.value = "";
  description.value = "";
}

function show(obj) {
  // Create new li element
  var li = document.createElement("li");
  // Add class
  li.className = "list-group-item";

  // Create del button element
  var deletebtn = document.createElement("button");

  // Add classes to del button
  deletebtn.className = "btn btn-danger btn-sm float-right delete";

  // Append text node
  deletebtn.appendChild(document.createTextNode("X"));

  // Add text node with input value
  li.textContent =
    obj.amount +
    " " +
    "-" +
    " " +
    obj.description +
    " " +
    "-" +
    " " +
    obj.category;

  deletebtn.onclick = async () => {
    const id = obj.id;
    itemList.removeChild(li);
    await axios
      .delete(`http://localhost:4000/user/delete-expense/${id}`, {
        headers: { Authorization: token },
      })
      .catch((err) => console.log(err));
  };

  li.appendChild(deletebtn);
  itemList.appendChild(li);
}

function showAllExpenses() {
  itemList.innerHTML = "";
  axios
    .get("http://localhost:4000/user/all-expenses", {
      headers: { Authorization: token },
    })
    .then((res) => {
      const data = res.data;
      for (let i = 0; i < data.length; i++) {
        show(data[i]);
      }
    })
    .catch((err) => console.log(err));
}

window.addEventListener("DOMContentLoaded", showAllExpenses);

btnBuyPremium.onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:4000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  let options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      await axios.post(
        "http://localhost:4000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          cons: console.log(response),
        },
        { headers: { Authorization: token } }
      );

      ispremium();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert("something went wrong");
  });
};

const ispremium = async (e) => {
  const response = await axios.get(
    "http://localhost:4000/user/is-premium-user",
    {
      headers: { Authorization: token },
    }
  );
  const premium = response.data;
  localStorage.setItem("pro", premium);
  if (response.data) {
    btnBuyPremium.remove();
    const premiumUser = document.createElement("h3");
    premiumUser.className = "float-right";
    premiumUser.textContent = "Premium Member";
    premium.appendChild(premiumUser);
    const generateReport = document.createElement("a");
    generateReport.href = "./day-to-day-expenses.html";
    generateReport.className = "btn btn-outline-dark text-white";
    premium.appendChild(generateReport);
  }
};
ispremium();

btnLeaderBoard.onclick = async () => {
  leaderBoardTitle.textContent = "Leader Board";
  const response = await axios.get(
    "http://localhost:4000/premium/showleaderboard",
    { headers: { Authorization: token } }
  );
  const data = response.data;
  leaderBoardList.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    showLeaderBoard(data[i]);
  }
};

function showLeaderBoard(obj) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent =
    "Name" +
    " - " +
    obj.name +
    " " +
    " " +
    "Total Expenses" +
    " - " +
    obj.totalExpenses;
  leaderBoardList.appendChild(li);
}
