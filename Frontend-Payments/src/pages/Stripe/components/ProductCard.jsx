import styles from "../Stripe.module.scss";
const ProductCard = ({ product, setCurrentProduct }) => {
  return (
<div className="col-sm-4 mb-4">
          <div className="card" style={{width:"auto", minHeight:"340px"}} >
            <img src={product.updatedProduct.thumbnail}  className={styles.imgCard}  alt="..." />
            <div className="card-body">
              <h5 className="card-title"><u>{product.updatedProduct.title}</u></h5>
              <p className="card-text"><strong>Precio:</strong> ${product.updatedProduct.price}</p>
              <p className="card-text"><strong>Cantidad:</strong> {product.quantity}
                {product.updatedProduct.quantity}</p>
              <p className="card-text"><strong>Total:</strong> ${product.amount}</p>
            </div>
          </div>
        </div>
  );
};

export default ProductCard;
