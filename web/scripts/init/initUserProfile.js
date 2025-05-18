import { supabase } from "../api/database.js";

document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    uname: document.getElementById("current-name"),
    email: document.getElementById("current-email"),
    password: document.getElementById("current-userpass"),
    avatar: document.getElementById("avatar"),

    newName: document.getElementById("newN"),
    newEmail: document.getElementById("newE"),
    newPass: document.getElementById("newP"),
    repeatPass: document.getElementById("rNewPass"),
    newAvatar: document.getElementById("newA"),
    avatarFile: document.getElementById("newAvatar"),

    editName: document.getElementById("edit1"),
    editEmail: document.getElementById("edit2"),
    editPass: document.getElementById("edit4"),
    editAvatar: document.getElementById("edit-avatar"),

    cancel1: document.getElementById("cancel1"),
    cancel2: document.getElementById("cancel2"),
    cancel3: document.getElementById("cancel3"),
    cancel4: document.getElementById("cancel4"),

    submitName: document.getElementById("submitNewName"),
    submitEmail: document.getElementById("submitNewEmail"),
    submitPass: document.getElementById("submitNPass"),
    submitAvatar: document.getElementById("submitNewAvatar"),

    avatarImg: document.getElementById("avatar-pic"),
  };

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

  async function loadUserProfile() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error("Auth error:", error);
      return;
    }

    const isEmailUser = user.app_metadata?.provider === "email";
    const meta = user.user_metadata;

    const name = isEmailUser ? meta.display_name : meta.full_name;
    const email = meta.email;
    const avatarLink = isEmailUser ? meta.avatarLink : meta.avatar_url;

    elements.uname.innerHTML = createEditableLine("Name", name, "edit1");
    elements.email.innerHTML = createEditableLine("Email", email, "edit2");
    elements.avatar.innerHTML = createAvatarHTML(avatarLink, isEmailUser);
    if (isEmailUser) {
      elements.password.innerHTML = createEditableLine("Password", "********", "edit4");
    }

    // Attach listeners after DOM injection
    attachEditListeners(isEmailUser);
  }

  function attachEditListeners(isEmailUser) {
    document.getElementById("edit1").addEventListener("click", () => {
      elements.newName.style.display = "flex";
    });
    document.getElementById("edit2").addEventListener("click", () => {
      elements.newEmail.style.display = "flex";
    });
    if (isEmailUser) {
      document.getElementById("edit4").addEventListener("click", () => {
        elements.newPass.style.display = "flex";
      });
      document.getElementById("edit-avatar").addEventListener("click", () => {
        elements.newAvatar.style.display = "flex";
      });
    }
  }

  // Cancel buttons
  elements.cancel1.onclick = () => {
    elements.newName.style.display = "none";
    elements.newName.querySelector("input").value = "";
  };
  elements.cancel2.onclick = () => {
    elements.newEmail.style.display = "none";
    elements.newEmail.querySelector("input").value = "";
  };
  elements.cancel3.onclick = () => {
    elements.newPass.style.display = "none";
    elements.newPass.querySelectorAll("input").forEach((el) => el.value = "");
  };
  elements.cancel4.onclick = () => {
    elements.newAvatar.style.display = "none";
    elements.avatarFile.value = "";
  };

  // Submit Handlers
  elements.submitName.onclick = async () => {
    await supabase.auth.updateUser({
      data: { display_name: elements.newName.querySelector("input").value },
    });
    elements.newName.style.display = "none";
    loadUserProfile();
  };

  elements.submitEmail.onclick = async () => {
    await supabase.auth.updateUser({ email: elements.newEmail.querySelector("input").value });
    elements.newEmail.style.display = "none";
    loadUserProfile();
  };

  elements.submitPass.onclick = async () => {
    const np = elements.newPass.querySelector("#newPass").value;
    const rnp = elements.newPass.querySelector("#rNewPass").value;

    if (np !== rnp) {
      alert("Passwords do not match.");
      return;
    }

    await supabase.auth.updateUser({ password: np });
    elements.newPass.style.display = "none";
  };

  elements.submitAvatar.onclick = async () => {
    const file = elements.avatarFile.files[0];
    if (!file) return alert("Please select an image.");

    const user = (await supabase.auth.getUser()).data.user;
    const filePath = `avatars/${user.id}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("profilepic")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError);
      return;
    }

    await supabase.auth.updateUser({
      data: { avatarLink: filePath },
    });

    const { data: signedUrlData } = await supabase.storage
      .from("profilepic")
      .createSignedUrl(filePath, 60);

    if (signedUrlData?.signedUrl) {
      elements.avatarImg.src = signedUrlData.signedUrl;
    }

    elements.newAvatar.style.display = "none";
  };

  // Initial load
  loadUserProfile();
});
