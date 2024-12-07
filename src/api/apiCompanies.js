import supabaseClient, { supabaseUrl } from "@/utils/supabase";  // Import supabaseUrl

// Fetch companies
export async function getCompanies(token) {
  try {
    if (!token) {
      console.error("No authentication token provided");
      return null;
    }

    const supabase = supabaseClient(token);
    const { data, error } = await supabase.from("companies").select('*');

    if (error) {
      console.error("Error Fetching Companies:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error fetching companies:", err.message);
    return null;
  }
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  try {
    if (!companyData.logo) {
      throw new Error("Logo file is required");
    }

    const supabase = supabaseClient(token);
    const random = Math.floor(Math.random() * 90000);
    const fileName = `logo-${random}-${companyData.name}`;

    // Upload the logo to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("company-logo")
      .upload(fileName, companyData.logo);

    if (storageError) {
      throw new Error("Error uploading Company Logo");
    }

    // Generate the logo URL using the imported supabaseUrl
    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

    // Insert the company details into the 'companies' table
    const { data, error } = await supabase
      .from("companies")
      .insert([{ name: companyData.name, logo_url }])
      .select();

    if (error) {
      console.error("Error inserting company:", error.message);
      throw new Error("Error submitting company");
    }

    return data;
  } catch (err) {
    console.error("Unexpected error adding company:", err.message);
    throw err;
  }
}
