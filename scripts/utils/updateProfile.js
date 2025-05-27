import { supabase } from "../api/database.jscha";
import { filesArray } from "../utils/fileUploadFunc.js";

document.addEventListener("DOMContentLoaded", async () => {
  const updateName = document.getElementById("submitNewName");
  const updateEmail = document.getElementById("submitNewEmail");
  const updatePass = document.getElementById("submitNPass");
  const updateAvatar = document.getElementById("submitNewAvatar");

  const repeatPass = document.getElementById("rNewPass");
  const newEmail = document.getElementById("newEmail");
  const newName = document.getElementById("newName");
  const newAvatar = document.getElementById("newAvatar");

  const { data: sessionData, error: userError } = await supabase.auth.getUser();
  const user = sessionData?.user;
  if (userError || !user) {
    console.error("User not logged in", userError);
    return;
  }

  // ✅ Update Name
  updateName.addEventListener("click", async () => {
    const name = newName.value;
    const { error: dbError } = await supabase
      .from("userData")
      .update({ display_name: name })
      .eq("userId", user.id);

    const { error: metaError } = await supabase.auth.updateUser({
      data: { display_name: name },
    });

    if (dbError || metaError) {
      console.error("❌ Error updating name:", dbError || metaError);
    } else {
      console.log("✅ Display name updated");
    }
  });

  // ✅ Update Email
  updateEmail.addEventListener("click", async () => {
    const email = newEmail.value;
    const { error: dbError } = await supabase
      .from("userData")
      .update({ email })
      .eq("userId", user.id);

    const { error: authError } = await supabase.auth.updateUser({ email });

    if (dbError || authError) {
      console.error("❌ Error updating email:", dbError || authError);
    } else {
      console.log("✅ Email updated");
    }
  });

  // ✅ Update Password
  updatePass.addEventListener("click", async () => {
    const password = repeatPass.value;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error("❌ Error updating password:", error.message);
    } else {
      console.log("✅ Password updated");
    }
  });

  // ✅ Update Avatar
  updateAvatar.addEventListener("click", async () => {
    const fileProf = filesArray[0];
    if (!fileProf) {
      console.error("⚠️ No file selected");
      return;
    }

    const filePath = `uploads/${Date.now()}_${fileProf.name}`;
    
    // Upload new image
    const { error: uploadError } = await supabase.storage
      .from("profilepic")
      .upload(filePath, fileProf, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Failed to upload avatar:", uploadError.message);
      return;
    }

    // Update database with new avatar path
    const { error: dbError } = await supabase
      .from("userData")
      .update({ avatarPath: filePath })
      .eq("udataId", user.id);

    if (dbError) {
      console.error("❌ Failed to update avatar path:", dbError.message);
    } else {
      console.log("✅ Avatar updated");
    }
  });
});
