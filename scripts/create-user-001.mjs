const PB_URL = 'http://127.0.0.1:8090';

const ADMIN_EMAIL = 'admin@guild.com';
const ADMIN_PASSWORD = 'admin12345678';

async function api(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json', 'Connection': 'close' };
  if (token) headers['Authorization'] = token;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${PB_URL}${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} failed: ${res.status} - ${text}`);
  }
  return res.json();
}

async function main() {
  console.log('Authenticating as admin...');
  const auth = await api('/api/collections/_superusers/auth-with-password', 'POST', {
    identity: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const token = auth.token;

  console.log('Creating User 001...');
  
  const userData = {
    username: 'cigano',
    email: 'cigano@guild.com',
    password: 'password123',
    passwordConfirm: 'password123',
    name: 'Bruno Fabricio',
    path: 'mago',
    level: 99,
    xp: 15000,
    is_founder: true,
    is_admin: true,
    bio: 'Idealizador e Mestre da Guilda.',
    emailVisibility: true
  };

  try {
    const user = await api('/api/collections/users/records', 'POST', userData, token);
    console.log('User created successfully:', user.id);
  } catch (e) {
    console.error('Error creating user:', e.message);
  }
}

main();
