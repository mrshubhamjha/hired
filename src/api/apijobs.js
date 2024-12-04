import supabaseClient from "@/utils/supabase";

// Fetch jobs based on location, company_id, and searchQuery
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token); // Get the supabase client

  let query = supabase.from("jobs").select("*,company:companies(name,logo_url),saved:saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs", error);
    return null;
  }

  return data;
}

// Save or remove a job from saved jobs
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token); // Get the supabase client

  if (alreadySaved) {
    // If the job is already saved, delete it
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error Deleting Saved Job", deleteError);
      return null;
    }
    return data; // Return the deleted data (or an empty array)
  } else {
    // If not saved, insert the job into saved_jobs
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error Inserting Saved Job", insertError);
      return null;
    }

    return data; // Return the inserted data
  }
}
