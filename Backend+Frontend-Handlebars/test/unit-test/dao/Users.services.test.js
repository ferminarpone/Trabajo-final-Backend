import mongoose from "mongoose";
import { expect } from "chai";
import { userServices } from "../../../src/services/service.js";

const MONGO_URL ='mongodb+srv://tester:coderhouse@testing.kqz07pc.mongodb.net/ecommerceTesting?retryWrites=true&w=majority&appName=Testing'
mongoose.connect(MONGO_URL);

console.log(userServices)
/* const expect = chai.expect; */


describe('Testing User Dao', ()=>{
    before(function () {
        this.userServices = userServices;
    })

    beforeEach(function (){
        this.timeout(5000)
        mongoose.connection.collections.users.drop()
    })
    it('El dao debe devolver los usuarios en forma de arreglo', async function () {   
        //Given
        const isArray = [];
        
        //Then
        const result = await this.userServices.getUsers()

        //Assert that
        expect(result).to.be.deep.equal(isArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.eql(true);
        expect(result.length).to.be.deep.equal(isArray.length);
    })

    it('El dao debe agregar un usuario a la DB correctamente', async function(){

        //Given
        const user = {
            first_name: "Fermin",
            last_name: "Arpone",
            email: "arponefermin@gmail.com",
            age: 27,
            password: "123qwe",
        }

        //Then
        const result = await this.userServices.createUser(user);

        //Assert That
        expect(result).to.be.ok.and.have.deep.property("_id")
        expect(result._id).to.be.ok
    })

    afterEach(function () {
        mongoose.connection.collections.users.drop();
    })
}) 
