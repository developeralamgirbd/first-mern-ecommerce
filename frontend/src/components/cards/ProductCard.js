import { Badge } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";

const ProductCard = ({ p, photo }) => {
    // context
    const [cart, setCart] = useCart();
    // hooks
    const navigate = useNavigate();

    return (
        <div className="card mb-3 hoverable">
            <Badge.Ribbon text={`${p?.sold} sold`} color="red">
                <Badge.Ribbon
                    text={`${
                        p?.quantity >= 1
                            ? `${p?.quantity - p?.sold} in stock`
                            : "Out of stock"
                    }`}
                    placement="start"
                    color="green"
                >
                    {/*? photo : `${process.env.REACT_APP_API_BASE_URL}/product/photo/${p._id}*/}
                    <img
                        className="card-img-top"
                        src={ photo}
                        alt={p.name}
                        style={{ height: "300px", objectFit: "cover" }}
                    />
                </Badge.Ribbon>
            </Badge.Ribbon>

            <div className="card-body">
                <h5>{p?.name}</h5>

                <h4 className="fw-bold">
                    {p?.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })}
                </h4>

                <p className="card-text">{p?.description?.substring(0, 60)}...</p>
            </div>

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-primary col card-button"
                    style={{ borderBottomLeftRadius: "5px" }}
                    onClick={() => navigate(`/product/${p.slug}`)}
                >
                    View Product
                </button>

                <button
                    className="btn btn-outline-primary col card-button"
                    style={{ borderBottomRightRadius: "5px" }}
                    onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem("cart", JSON.stringify([...cart, p]));
                        toast.success("Added to cart");
                    }}
                >
                    Add to Cart
                </button>
            </div>

            {/* <p>{moment(p.createdAt).fromNow()}</p>
      <p>{p.sold} sold</p> */}
        </div>
    );
}

export default ProductCard;