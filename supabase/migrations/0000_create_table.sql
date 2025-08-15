-- Create table
CREATE TABLE table_name (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- other columns
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation needed
CREATE POLICY "policy_name_select" ON table_name
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "policy_name_insert" ON table_name
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "policy_name_update" ON table_name
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "policy_name_delete" ON table_name
FOR DELETE TO authenticated USING (auth.uid() = user_id);