const supertest = require("supertest");
const app = require("../..");
const { clearDatabase } = require("../../db.connection");

let req = supertest(app);

describe("lab testing:", () => {
    let newUser, token;

    beforeEach(async () => {
        newUser = { name: "Ali", email: "asd@asd.com", password: "asdasd" };
        await req.post("/user/signup").send(newUser);
        let res = await req.post("/user/login").send(newUser);
        token = res.body.data;
    });

    afterEach(async () => {
        await clearDatabase();
    });

    describe("users routes:", () => {
        it("req to get(/user/search) ,expect to get the correct user with his name", async () => {
            let res = await req.get("/user/search").query({ name: newUser.name });
            expect(res.status).toBe(200);
            expect(res.body.data.name).toBe(newUser.name);
        });

        it("req to get(/user/search) with invalid name ,expect res status and res message to be as expected", async () => {
            let res = await req.get("/user/search").query({ name: "InvalidName" });
            expect(res.status).toBe(200);
            expect(res.body.message).toContain("There is no user with name");
        });
    });

    describe("todos routes:", () => {
        it("req to patch( /todo/) with id only ,expect res status and res message to be as expected", async () => {
            let res = await req.patch("/todo/12345").set({ authorization: token });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("must provide title and id to edit todo");
        });

        it("req to patch( /todo/) with id and title ,expect res status and res to be as expected", async () => {
            let todoRes = await req.post("/todo").send({ title: "reading book" }).set({ authorization: token });
            let todoId = todoRes.body.data?._id;

            let res = await req.patch(`/todo/${todoId}`).send({ title: "updated title" }).set({ authorization: token });

            expect(res.status).toBe(200);
            expect(res.body.data?.title).toBe("updated title");
        });


        fit("req to get( /todo/user) ,expect to get all user's todos", async () => {
           let todoRes= await req.post("/todo").send({ title: "new todo" }).set({ authorization: token });
        console.log(todoRes.body.data);
        
            // console.log("Sending request with token:", token);
            let res = await req.get("/todo/user").set({ authorization: token });
           // console.log(res.body);
            expect(true).toBe(true)            
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
        

        it("req to get( /todo/user) ,expect to not get any todos for user hasn't any todo", async () => {
            let newUser2 = { name: "Omar", email: "omar@asd.com", password: "omar123" };
            await req.post("/user/signup").send(newUser2);
            let loginRes = await req.post("/user/login").send(newUser2);
            let newToken = loginRes.body.data;
            console.log(newToken);
            let res = await req.get("/todo/user").set({ authorization: newToken });
            expect(res.status).toBe(200);
            expect(res.body.message).toContain("Couldn't find any todos");
        })
        // afterAll(async () => {
        //     await clearDatabase()
        // })
    });
});
