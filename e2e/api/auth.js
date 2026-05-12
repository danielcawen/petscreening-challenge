export async function postAuth(apiContext, body) {
  return apiContext.post("/api/auth", { data: body });
}
