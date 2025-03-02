const supertest = require("supertest")
const app = require("../..")
const { clearDatabase } = require("../../db.connection")

let req=supertest(app)

describe("user routes",()=>{
    let newUser,userInDB
    beforeEach(()=>{

         newUser={ name:"Ali",email:"asd@asd.com",password:"asdasd" }

    })
    afterAll(async()=>{
       await clearDatabase()
    })
    it("req get(/user/): res should be []", async () => {
        let res= await req.get("/user")

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveSize(0)
    } )

    it("req post(/user/signup): res should be the just added user ",async()=>{
        
           let res=await req.post("/user/signup").send(newUser)
           expect(res.status).toBe(201)
           expect(res.body.data.name).toEqual(newUser.name)
           userInDB=res.body.data
    })
    it("req get(/user/login): res should be token",async () => {
        let res= await req.post("/user/login").send(newUser)
        
        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
    })
    it("req get(/user/login): with wrong password, res should be token",async () => {
        let res= await req.post("/user/login").send({email:newUser.email,password:"xxx"})
        
        expect(res.status).toBe(401)
        expect(res.body.message).toContain("Invalid")
    })
    it("req get(/user/id) : res should be the user",async () => {
        let res= await req.get("/user/"+userInDB._id)

        expect(res.status).toBe(200)
        expect(res.body.data).toEqual(userInDB)
    })
})