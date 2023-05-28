const request = require("supertest");
const app = require("../index");
const User = require("../models/user.model");

const cleanData = async (emails) => {
  await User.deleteMany({ email: { $in: emails } });
};
const createData = async (data) => {
  await request(app).post("/api/user/register").send(data);
};

const loginUser = async (data) => {
  const responseData = await request(app).post("/api/user/login").send(data);
  return responseData.body.data?.token;
};
describe("POST api/user/register", () => {
  afterAll(async () => {
    await cleanData(["testuser@gmail.com"]);
  });
  it("Should return status code 201", async () => {
    const payload = {
      name: "testUser",
      email: "testuser@gmail.com",
      password: "testPassword",
      confirm_password: "testPassword",
    };
    const response = await request(app)
      .post("/api/user/register")
      .send(payload);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User created and stored in db"
    );
  });
  it("Should return status code 400 as password and confirm password did not matched", async () => {
    const payload = {
      name: "testUser",
      email: "testuser1@gmail.com",
      password: "testPassword",
      confirm_password: "testPassword1",
    };
    const response = await request(app)
      .post("/api/user/register")
      .send(payload);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Validation Errors");
  });
  it("Should return status code 400 as email is duplicated", async () => {
    const payload = {
      name: "testUser",
      email: "testuser@gmail.com",
      password: "testPassword",
      confirm_password: "testPassword",
    };
    const response = await request(app)
      .post("/api/user/register")
      .send(payload);
    expect(response.status).toBe(400);
  });
});

describe("POST api/user/login", () => {
  const userBody = {
    name: "testUser",
    email: "testuser@gmail.com",
    password: "testPassword",
    confirm_password: "testPassword",
  };
  beforeAll(async () => {
    await createData(userBody);
  });
  afterAll(async () => {
    await cleanData([userBody.email]);
  });
  it("Should return status code 200 with token", async () => {
    const payload = {
      email: "testuser@gmail.com",
      password: "testPassword",
    };
    const response = await request(app).post("/api/user/login").send(payload);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });
  it("Should return status code 401 as password is incorrect", async () => {
    const payload = {
      email: "testuser@gmail.com",
      password: "testPassword1",
    };
    const response = await request(app).post("/api/user/login").send(payload);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Provided Credentials are Invalid"
    );
  });
});

describe("api/user/profile", () => {
  const userBody = {
    name: "testUser",
    email: "testuser@gmail.com",
    password: "testPassword",
    confirm_password: "testPassword",
  };
  let token;
  beforeAll(async () => {
    await createData(userBody);
    token = await loginUser({
      email: userBody.email,
      password: userBody.password,
    });
  });
  afterAll(async () => {
    await cleanData([userBody.email]);
  });
  test("GET Response should be user data with status code 200", async () => {
    const response = await request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user).toHaveProperty("id");
    expect(response.body.data.user.email).toBe(userBody.email);
    expect(response.body.data.user.name).toBe(userBody.name);
  });
  test("GET Response should be status code 400", async () => {
    const response = await request(app)
      .get("/api/user/profile")
      .set("Authorization", "Bearer thisisinvalidjwt");
    expect(response.status).toBe(400);
  });
  test("PUT Update user email with status code 200", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "testuser1@gmail.com" });
    expect(response.status).toBe(200);
  });
  test("PUT Update user name with status code 200", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "testUser1" });
    expect(response.status).toBe(200);
  });
  test("PUT Update user name & email with status code 200", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "testUser", email: "testuser@gmail.com" });
    expect(response.status).toBe(200);
  });
  test("PUT Response should be an error with status code 400 because no data is provided", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(response.status).toBe(400);
  });
  test("PUT Response should be an error with status code 400 because name is empty", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "" });
    expect(response.status).toBe(400);
  });
  test("PUT Response should be an error with status code 400 because email is empty & not a valid email", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "" });
    expect(response.status).toBe(400);
  });
  test("DELETE Response should be user data with status code 200", async () => {
    const response = await request(app)
      .delete("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user).toHaveProperty("id");
    expect(response.body.data.user.email).toBe(userBody.email);
    expect(response.body.data.user.name).toBe(userBody.name);
  });
});
