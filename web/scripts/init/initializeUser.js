//get the client UID
//get the products enlisted by the user
//redirect the user-page based on the user-type
import {supabase} from '../api/database.js'
let sessionUserID = "";
console.log("Supabase is connected!");
async function isAdmin() {
  const admin = await supabase
    .from("panelConfig")
    .select("isAdmin")
    .eq("uuid", sessionUserID);
  console.log(admin)
  return admin;
}
export async function isDarkMode() {
  const admin = await supabase
    .from("panelConfig")
    .select("isDark")
    .eq("uuid", sessionUserID);
}

export async function isCollapsed() {
  const admin = await supabase
    .from("panelConfig")
    .select("isCollapsed")
    .eq("uuid", sessionUserID);
}
const landingPageAfterLogin = isAdmin()
  ? window.location.origin + "/web/pages/admin-page.html"
  : window.location.origin + "/web/pages/main-menu.html";

async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  })
  if (error) {
    throw error;
  }else{
    addUserConfig();
    console.log(isAdmin())
    window.location.href = landingPageAfterLogin;
  }
}
 function addUserConfig(){
  const { data } = supabase.from("panelConfig").insert([
    {
      uuid: sessionUserID,
      isCollapsed: false,
      isDark: false,
      isAdmin: false,
    },
  ]);
}
const {
  data: { user },
  error,
} = await supabase.auth.getUser();

if (error) {
  console.error("Error fetching user:", error.message);
} else {
  sessionUserID = user.id;
  console.log("User ID:", user.id);
}

//registration
document.getElementById("submitRegForm").addEventListener("click", () => {
  let repass = document.getElementById("rrpass").value;
  let pass = document.getElementById("rpass").value;
  if (pass == repass) {
    registerWithEmail(
      document.getElementById("remail").value,
      document.getElementById("rpass").value,
      document.getElementById("rname").value
    );
  } else {
    alert("Password don't match");
  }
});
async function registerWithEmail(remail, rpassword, rusername) {
  const { user, error } = await supabase.auth.signUp({
    email:remail,
    password:rpassword,
    options: {
      data: {
        username: rusername,
      },
    },
  });
  console.log({ remail, rpassword, rusername });

  sessionUserID = user.id;
  const { data } = await supabase.from("panelConfig").insert([
    {
      uuid: sessionUserID,
      isCollapsed: false,
      isDark: false,
      isAdmin: false,
    },
  ]);
  if (error) throw error;
}
//login
let loginGoogle = document.querySelectorAll(".googleLogin");
loginGoogle.forEach((button) => {
  button.addEventListener("click", () => {
    loginWithGoogle();
  });
});
