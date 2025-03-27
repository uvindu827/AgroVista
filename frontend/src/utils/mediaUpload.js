import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ikcioekwnugctxziblfb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrY2lvZWt3bnVnY3R4emlibGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NTUyNDYsImV4cCI6MjA1ODUzMTI0Nn0.-P6HemXwUQFLpSUPOn7-bKR8YrPbCNF78JPj87bbty4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function mediaUpload(file) {
  try {
    if (!file) {
      throw new Error("No file selected");
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error("Error uploading file: " + error.message);
    }

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}
