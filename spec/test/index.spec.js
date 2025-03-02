const supertest = require("supertest")
const app = require("../..")

let req=supertest(app)

describe("root request:",()=>{
    it("req get(/): res should be []",async()=>{
        let res=await  req.get("/")

        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([])
    })
    it("req get(/xx): res should be 'Not found' ",async()=>{
       let res=await req.get("/xx")

       expect(res.status).toBe(404)
       expect(res.body.message).toBe("Not found")
    })
})