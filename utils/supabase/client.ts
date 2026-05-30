import { createClient as createLibClient } from "@/lib/supabase/client";

export function createClient() {
  return createLibClient();
}
