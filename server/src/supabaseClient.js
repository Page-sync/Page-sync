const { createClient } = require("@supabase/supabase-js");
console.log(process.env.SUPABASE_URL);
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
