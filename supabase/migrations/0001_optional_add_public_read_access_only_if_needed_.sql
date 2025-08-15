-- ONLY add this policy if public profile viewing is specifically required
CREATE POLICY "profiles_public_read_policy" ON public.profiles
FOR SELECT USING (true);