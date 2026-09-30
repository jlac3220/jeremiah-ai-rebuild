export async function askJeremiahTeacher(payload, signal) {
  const response = await fetch("/api/jeremiah/teach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error || "Jeremiah could not respond right now.");
    error.status = response.status;
    throw error;
  }

  return data;
}
