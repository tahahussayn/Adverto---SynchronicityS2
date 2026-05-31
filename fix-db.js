const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = envFile.split(/\r?\n/).reduce((acc, line) => {
  const match = line.trim().match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2].trim();
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data, error } = await supabase
    .from('creatives')
    .update({ status: 'published' })
    .eq('status', 'publishing')
    .select();
  
  if (error) {
    console.error('Error fixing DB:', error);
  } else {
    console.log('Fixed stuck creatives:', data ? data.length : 0);
  }
}

fix();
