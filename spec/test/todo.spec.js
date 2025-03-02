const supertest = require("supertest");
const app = require("../..");
const { clearDatabase } = require("../../db.connection");

let req = supertest(app);
describe("todo routes", () => {
    let newUser,token,todoInDB
  afterAll(async () => {
    await clearDatabase();
  });
  beforeEach(async()=>{
    newUser={ name:"Ali",email:"asd@asd.com",password:"asdasd" }
    await req.post("/user/signup").send(newUser)
     res=await req.post("/user/login").send(newUser)
     token=res.body.data
  })
  it("req get(/todo/): res should be []", async () => {
    let res = await req.get("/todo");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveSize(0);
  });

  it("req post(/todo): with no auth res should be 401",async()=>{
    let res= await req.post("/todo").send({title:"xxx"})

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/login first/)
  })
  it("req post(/todo): with auth res should be new todo",async()=>{
    let res= await req.post("/todo").send({title:"reading book"}).set({authorization:token})

    expect(res.status).toBe(201)
    expect(res.body.data.title).toBe("reading book")
    todoInDB= res.body.data
  })
  it("req get(/todo/id): with auth res should be new todo",async()=>{
    let res= await req.get("/todo/"+todoInDB._id).set({authorization:token})

    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe("reading book")
  })
  
});
