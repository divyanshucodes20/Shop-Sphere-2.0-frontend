import { CarouselButtonType, MyntraCarousel, Slider } from "6pp";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/loader";
import { useGetReusableProductDetailsQuery } from "../redux/api/reusableAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";

const ReusableProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { isLoading, isError, data } = useGetReusableProductDetailsQuery(params.id!);

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increment = () => {
    if (data?.product.productDetails.stock === quantity) {
      return toast.error(`${data?.product.productDetails.stock} available only`);
    }
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) {
      return toast.error("Out of stock!");
    }
    try {
      dispatch(addToCart(cartItem));
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  if (isError) return <Navigate to="/404" />;

  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <main>
          <section>
            <Slider
              showThumbnails
              showNav={false}
              onClick={() => setCarouselOpen(true)}
              images={data?.product.productDetails.photos.map((i) => i.url) || []}
            />
            {carouselOpen && (
              <MyntraCarousel
                NextButton={NextButton}
                PrevButton={PrevButton}
                setIsOpen={setCarouselOpen}
                images={data?.product.productDetails.photos.map((i) => i.url) || []}
              />
            )}
          </section>
          <section>
            <code>{data?.product.productDetails.category}</code>
            <h1>{data?.product.productDetails.name}</h1>
            <h3>₹{data?.product.totalPrice}</h3>
            <article>
              <div>
                <button onClick={decrement}>-</button>
                <span>{quantity}</span>
                <button onClick={increment}>+</button>
              </div>
              <button
                onClick={() =>
                  addToCartHandler({
                    productId: data?.product?._id!,
                    name: data?.product.productDetails.name!,
                    price: data?.product?.totalPrice!,
                    stock: data?.product.productDetails.stock!,
                    quantity,
                    photo: data?.product?.productDetails.photos[0].url || "",
                  })
                }
              >
                Add To Cart
              </button>
            </article>
            <p>{data?.product?.productDetails.description}</p>
          </section>
        </main>
      )}
    </div>
  );
};

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #f1f1f1",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <Skeleton
          width="100%"
          containerHeight="100%"
          height="100%"
          length={1}
        />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <Skeleton width="40%" length={3} />
        <Skeleton width="50%" length={4} />
        <Skeleton width="100%" length={2} />
        <Skeleton width="100%" length={10} />
      </section>
    </div>
  );
};

const NextButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowRightLong />
  </button>
);

const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowLeftLong />
  </button>
);

export default ReusableProductDetails;
