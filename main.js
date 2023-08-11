const form = document.getElementById("form");
const submitbtn = document.getElementById("submit");
const name1 = document.getElementById("name");
const email = document.getElementById("email");
const number = document.getElementById("number");
const password = document.getElementById("password");
const time = document.getElementById("time");
const list = document.getElementById("list");

form.addEventListener("submit", async function (e) {
  if (!form.checkValidity()) {
    e.preventDefault();
  } else {
    e.preventDefault();

    let myobj = {
      name: name1.value,
      email: email.value,
      number: number.value,
      password: password.value,
    };

    const res = await axios
      .post("http://localhost:4000/add-user", myobj)
      .catch((err) => console.log(err));
    if (res) {
      myobj.id = res.data;
    }

    name1.value = "";
    email.value = "";
    number.value = "";
    password.value = "";
  }
  form.classList.add("was-validated");
});
