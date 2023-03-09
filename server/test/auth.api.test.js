const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("POST /auth", () => {
  const newUser = {
    email: "test@lahore.com",
    password: "SuperUser123$",
  };
  let token = "";
  // it("should add an item to users array", async () => {
  //   const response = await request(baseURL).post("/auth/signup").send(newUser);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.token).not.toBeNull();
  //   token = response.body.token;
  //   expect(response.body.user.email).toBe(newUser.email);
  // });
  it("should be able to login", async () => {
    const response = await request(baseURL).post("/auth/signin").send(newUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.token).not.toBeNull();
    token = response.body.token;
    expect(response.body.user.email).toBe(newUser.email);
  });
  it("logout with token", async () => {
    const response = await request(baseURL)
      .post("/auth/signOut")
      .send()
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Token revoked successfully");
  });
});
