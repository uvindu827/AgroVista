import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hmmwjhjxwnhvxhjikfta.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbXdqaGp4d25odnhoamlrZnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzAyNjYsImV4cCI6MjA2MTE0NjI2Nn0.PyCOhleASc5DT8tbpG9nxinlOezY7tRDEMw4ZW-Z3Gw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function mediaUpload(file) {
  return new Promise((resolve, reject) => {

    if(file==null){
      reject("No File selected")
    }

    const timestamp = new Date().geteTime();
    const fileName = timestamp + file.name;
    supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      .then(() => {
        const publicUrl = supabase.storage.from("images").getPublicUrl(fileName)
          .data.publicUrl;
        resolve(publicUrl);
      }).catch(()=>{
        reject("Error uploading file")
      })
  });
}
