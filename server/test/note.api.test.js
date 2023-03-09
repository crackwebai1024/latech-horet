const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("POST /notes", () => {
  const newUser = {
    email: "test@lahore.com",
    password: "SuperUser123$",
  };
  const newNote = {
    title: "test",
    content: "test",
  };
  const updateNote = {
    title: "update test",
    content: "update test",
  };
  let token = "";
  let noteId = "";
  beforeEach(async () => {
    const response = await request(baseURL).post("/auth/signin").send(newUser);
    token = response.body.token;
  });

  it("should add an item to the notes array", async () => {
    const response = await request(baseURL)
      .post("/notes")
      .send(newNote)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Successfully created!");
    expect(response.body.note.title).toBe(newNote.title);
    expect(response.body.note.content).toBe(newNote.content);
    expect(response.body.note.userId).not.toBeNull();
    expect(response.body.note.noteId).not.toBeNull();
    noteId = response.body.note.noteId;
  });

  it("should update an item to the notes array", async () => {
    const response = await request(baseURL)
      .put(`/notes/${noteId}`)
      .send(updateNote)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.note.title).toBe(updateNote.title);
    expect(response.body.note.content).toBe(updateNote.content);
    expect(response.body.note._id).toBe(noteId);
  });

  it("get an item by id from the notes array", async () => {
    const response = await request(baseURL)
      .get(`/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.note.title).toBe(updateNote.title);
    expect(response.body.note.content).toBe(updateNote.content);
    expect(response.body.note._id).toBe(noteId);
  });

  it("delete an item by id from the notes array", async () => {
    const response = await request(baseURL)
      .delete(`/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Successfully deleted!");
  });
});
