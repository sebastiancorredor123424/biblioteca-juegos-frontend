const API_URL = "https://biblioteca-juegos-backend-production.up.railway.app";


export async function login(email, password) {
  const res = await fetch(`${API}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}
