import { generateProduct } from "../utils.js";

export const getProductsMockingController = async (req, res)=>{
    try {
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct());
        }
        res.send({ status: "success", payload: products });
    } catch (error) {
        req.logger.error("Error al generar usuarios mock: "+error.message)
        res.status(500).send({ error: error.message, message: "No se pudo obtener los usuarios:" });
    }
}