const fs = require('fs');
let content = fs.readFileSync('supabase_schema.sql', 'utf-8');

content = content.replace(
  `'employee'::public.user_role,`,
  `CASE WHEN new.email = 'onealmahinay@gmail.com' THEN 'system_admin'::public.user_role ELSE 'employee'::public.user_role END,`
);

fs.writeFileSync('supabase_schema.sql', content);
console.log('SQL Patched');
