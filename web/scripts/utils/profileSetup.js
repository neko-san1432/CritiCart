let uname = document.getElementById("current-name");
let email = document.getElementById("current-email");
let userType = document.getElementById("user-type");
let password = document.getElementById("current-userpass");
let w = "",
  x = "",
  y = "",
  z = "";
function getUser() {
  let tmp1 ='Name: xxxxxxx'+ '<button id = "edit1">1</button>',
    tmp2 = 'Email: xxxxxxx'+'<button id = "edit2">2</button>',
    tmp3 = 'User type: member'+'<button id = "edit3">3</button>',
    tmp4 = 'Password: xxxxxx'+'<button id = "edit4">4</button>';
  // logic here
  w = tmp1;
  x = tmp2;
  y = tmp3;
  z = tmp4;
  show();
}
function show() {
  uname.innerHTML = w;
  email.innerHTML = x;
  userType.innerHTML = y;
  password.innerHTML = z;
}
getUser();
console.log(uname)