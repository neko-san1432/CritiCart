import { supabase } from "../scripts/api/database.js";
let y = document.getElementById("x");
let sessionUserID = "";
let lemail = "pyrrhus@gmail.com";
let lpass = "123123";
(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: lemail,
    password: lpass,
  });
  if (error) {
    console.error("Login failed:", error.message);
  } else {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    sessionUserID = user.id;
    if(error){
      console.error('Cannot retrieve user')
    }
    console.log("User signed in:", data.user);
  }
})();
y.addEventListener("click", async () => {
  const { data, error } = await supabase.from("panelConfig").insert([
    {
      uuid: sessionUserID,
      isCollapsed: false,
      isDark: false,
      isAdmin: false,
    },
  ]);
  if (error) {
    console.error("Insert failed:", error.message);
    return;
  }
  console.log("Insert success:", data);
});
