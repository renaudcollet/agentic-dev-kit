# Rubric: 05-comments-table

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- A new migration file is created; the existing one is not edited.
- The table references `projects` and `auth.users` with sensible `on delete` behaviour.
- RLS is enabled on the table.
- Separate policies for select (everyone), insert, update and delete (own comments only).
- Insert uses `with check (auth.uid() = author_id)` (or equivalent); update uses both `using` and `with check`.
- No policy relies on a value sent by the client; no `service_role` usage.

## Human check
- Optional: apply the migration on a local Supabase and try to edit another user's comment.
