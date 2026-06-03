export async function getCurrentUser() {
  const res = await fetch("/admin/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) {
    return { user: null };
  }

  if (!res.ok) {
    throw new Error("Unable to fetch current user");
  }

  return res.json();
}

export async function logoutUser() {
  const res = await fetch("/admin/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json();
}
