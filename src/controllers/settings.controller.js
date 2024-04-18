import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { resetPasswordErrorInfo } from "../services/errors/messages/user-creation-error.message.js";
import { passwordService, userServices } from "../services/service.js";
import { createHash, isValidPassword } from "../utils.js";

export const resetPasswordController = async (req, res) => {
  const token = req.params.token;
  const { password1, password2 } = req.body;
  try {
    const pswInfo = await passwordService.getPswInfoByToken({ token });
    const now = new Date();
    if (now > pswInfo.expirationTime) {
      passwordService.deletePswInfo(pswInfo._id);
      CustomError.createError({
        name: "Link reset password Error",
        cause: resetPasswordErrorInfo(req),
        message: `Expired time`,
        code: EErrors.ROUTING_ERROR,
      });
    }
    const email = pswInfo.email;
    const user = await userServices.getUser({ email });
    if (password1 != password2)
      return res
        .status(400)
        .send({ message: "Contraseñas diferentes" });
    if (isValidPassword(user, password1))
      return res
        .status(400)
        .send({
          message: "Las contraseña nueva, debe ser distinta a la constraseña actual.",
        });
    await userServices.updateUser(user._id, {password: createHash(password1)})
    res.send({message: "Contraseña actualizada correctamente."});
  } catch (error) {
    if(error.message === "Expired time"){
      res.status(404).send(error.message)
    }else{
      res.status(500).send(error.message);
    }
  }
};
