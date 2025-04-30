//get the client UID
//get the products enlisted by the user
//redirect the user-page based on the user-type
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { DB_PUB_API, DB_PUB_URL } from "./database";
const supabaseUrl = DB_PUB_URL;
const supabaseKey = DB_PUB_API;
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase is connected!");

async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) throw error;
}

async function registerWithEmail(email, password, username) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, // store custom user metadata
      },
    },
  });

  if (error) throw error;
  return user;
}
const { data: { user }, error } = await supabase.auth.getUser();

if (error) {
  console.error('Error fetching user:', error.message);
} else {
  console.log('User ID:', user.id); // ✅ This is the UID
}
