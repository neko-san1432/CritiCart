import { supabase } from "../api/database.js";

const uname = document.getElementById("current-name");
const email = document.getElementById("current-email");
const password = document.getElementById("current-userpass");
const avatar = document.getElementById("avatar");

const editIcon = `
  <svg class="invert" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" 
    stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="m9.134 19.319 11.587-11.588c.171-.171.279-.423.279-.684 
    0-.229-.083-.466-.28-.662l-3.115-3.104c-.185-.185-.429-.277-.672-.277s-.486.092-.672.277l-11.606 
    11.566c-.569 1.763-1.555 4.823-1.626 5.081-.02.075-.029.15-.029.224 
    0 .461.349.848.765.848.511 0 .991-.189 5.369-1.681zm-3.27-3.342 
    2.137 2.137-3.168 1.046zm.955-1.166 
    10.114-10.079 2.335 2.327-10.099 10.101z" fill-rule="nonzero"/>
  </svg>`;

function createEditableLine(label, value, editId) {
  return `${label}: ${value} <button id="${editId}">${editIcon}</button>`;
}

function createAvatarHTML(src, isEditable = false) {
  const buttonHTML = isEditable
    ? `<button id="edit-avatar" style="width: 200px; height: 200px; z-index: 2; position: absolute; border-radius: 50%; display: flex; justify-content: center; align-items: center;">${editIcon}</button>`
    : "";

  return `
    <div style="width: 200px; height: 200px; border: solid; border-radius: 50%; position: relative;">
      ${buttonHTML}
      <img src="${src}" alt="prof-pic" style="width: 200px; height: 200px; border-radius: 50%;" />
    </div>`;
}

async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Failed to get user:", error);
    return;
  }

  const isEmailUser = user.app_metadata?.provider === "email";
  const meta = user.user_metadata;

  const userName = isEmailUser ? meta.display_name : meta.full_name;
  const userEmail = meta.email;
  const userAvatar = isEmailUser ? meta.avatarLink : meta.avatar_url;

  const nameHTML = createEditableLine("Name", userName, "edit1");
  const emailHTML = createEditableLine("Email", userEmail, "edit2");
  const avatarHTML = createAvatarHTML(userAvatar, isEmailUser);

  let passwordHTML = "";
  if (isEmailUser) {
    passwordHTML = createEditableLine("Password", meta.password, "edit4");
  }

  showUser({ nameHTML, emailHTML, avatarHTML, passwordHTML, isEmailUser });
}

function showUser({
  nameHTML,
  emailHTML,
  avatarHTML,
  passwordHTML,
  isEmailUser,
}) {
  uname.innerHTML = nameHTML;
  email.innerHTML = emailHTML;
  avatar.innerHTML = avatarHTML;
  if (isEmailUser) {
    password.innerHTML = passwordHTML;
  }
}

getUser();
document.getElementById("edit1").addEventListener("click", () => {
  //popup
  //get value
});
document.getElementById("edit2").addEventListener("click", () => {
  //popup
  //get value
});
document.getElementById("edit3").addEventListener("click", () => {
  //popup
  //get value
});
document.getElementById("edit-avatar").addEventListener("click", () => {
  //popup
  //get value
});
