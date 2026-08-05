import fs from 'fs';

const filePath = 'src/store/AuthContext.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Allow the specific user email and ensure they get system_admin role
content = content.replace(
  `if (!currentUser.email?.endsWith('@malungon.gov.ph')) {`,
  `if (!currentUser.email?.endsWith('@malungon.gov.ph') && currentUser.email !== 'onealmahinay@gmail.com') {`
);

content = content.replace(
  `role: 'employee',`,
  `role: currentUser.email === 'onealmahinay@gmail.com' ? 'system_admin' : 'employee',`
);

// We should also patch the fetched profile if they are already created as 'ict_support' or 'employee'
const patchFetch = `      } else {
        // Force system_admin for onealmahinay@gmail.com
        if (currentUser.email === 'onealmahinay@gmail.com' && data.role !== 'system_admin') {
          const { data: updatedData } = await supabase
            .from('profiles')
            .update({ role: 'system_admin' })
            .eq('id', currentUser.id)
            .select()
            .single();
          setProfile(updatedData || { ...data, role: 'system_admin' });
        } else {
          setProfile(data);
        }
      }`;

content = content.replace(
  `      } else {
        setProfile(data);
      }`,
  patchFetch
);

fs.writeFileSync(filePath, content);
console.log('Patched');
