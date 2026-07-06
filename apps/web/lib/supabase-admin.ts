import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase env 설정 오류');
  }

  return createClient(url, serviceRoleKey);
}
