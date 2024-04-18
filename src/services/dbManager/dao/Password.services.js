import { passwordModel } from "../models/password.model.js";

class PasswordServices {

    async createPswInfo(pswInfo){
        return await passwordModel.create(pswInfo);
    }

    async getPswInfoByToken(token) {
        return await passwordModel.findOne(token)
    }

    async deletePswInfo(id) {
        return await passwordModel.deleteOne(id)
    }
}

export default new PasswordServices()