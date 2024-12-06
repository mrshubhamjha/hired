import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery } = {}) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url), saved:saved_jobs(id)");

  if (location) query = query.eq("location", location);
  if (company_id) query = query.eq("company_id", company_id);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs", error);
    throw error;
  }

  return data;
}

export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  try {
    if (alreadySaved) {
      // Delete the saved job entry
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .match({
          user_id: saveData.user_id,
          job_id: saveData.job_id
        });

      if (error) throw error;
      return null;
    } else {
      // Use upsert to handle potential conflicts
      const { data, error } = await supabase
        .from("saved_jobs")
        .upsert({
          user_id: saveData.user_id,
          job_id: saveData.job_id
        }, {
          onConflict: 'user_id,job_id'
        })
        .select();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Job save/unsave error:", error);
    throw error;
  }
}

export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) throw new Error(`Job creation failed: ${error.message}`);

  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select('*, job:jobs(*, company:companies(name,logo_url))');

  if (error) throw new Error(`Saved jobs fetch failed: ${error.message}`);

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}