import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaRegStar,
  FaStar,
} from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/loader";
import RatingsComponent from "../components/ratings";
import {
  useAllReviewsOfProductsQuery,
  useDeleteReviewMutation,
  useNewReviewMutation,
  useProductDetailsQuery,
} from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { CartItem, Review } from "../types/types";
import { responseToast } from "../utils/features";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, isError, data } = useProductDetailsQuery(params.id!);
  const reviewsResponse = useAllReviewsOfProductsQuery(params.id!);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [reviewComment, setReviewComment] = useState("");
  const reviewDialogRef = useRef<HTMLDialogElement>(null);
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

  const [createReview] = useNewReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      toast.error("Quantity cannot be less than 1");
    }
  };

  const increment = () => {
    if (data?.product?.stock === quantity) {
      return toast.error(`${data?.product?.stock} available only`);
    }
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = async (cartItem: CartItem) => {
    if (!cartItem || typeof cartItem.stock !== "number") {
      return toast.error("Invalid product details");
    }

    if (cartItem.stock < 1) {
      try {
        const response = await fetch(`${server}/api/v1/notification/new?userId=${user?._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: cartItem.productId,
            email: user?.email,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return toast.error(data.message || "Failed to create notification.");
        }

        return toast.error(
          "Out of stock! You will be notified when the product is back in stock."
        );
      } catch (error) {
        console.error("Error creating notification:", error);
        return toast.error("An error occurred. Please try again.");
      }
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

  const showDialog = () => {
    reviewDialogRef.current?.showModal();
  };

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      justifyContent: "flex-start",
    },
  });

  const reviewCloseHandler = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setReviewComment("");
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewSubmitLoading(true);
    reviewCloseHandler();

    const res = await createReview({
      comment: reviewComment,
      rating,
      userId: user?._id,
      productId: params.id!,
    });

    setReviewSubmitLoading(false);

    responseToast(res, null, "");
  };

  const handleDeleteReview = async (reviewId: string) => {
    const res = await deleteReview({ reviewId, userId: user?._id });
    responseToast(res, null, "");
  };

  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <main>
            <section>
              <Slider
                showThumbnails
                showNav={false}
                onClick={() => setCarouselOpen(true)}
                images={data?.product?.photos.map((i) => i.url) || []}
              />
              {carouselOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                  images={data?.product?.photos.map((i) => i.url) || []}
                />
              )}
            </section>
            <section>
              <code>{data?.product?.category}</code>
              <h1>{data?.product?.name}</h1>
              <em
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <RatingsComponent value={data?.product?.ratings || 0} />({
                  data?.product?.numOfReviews
                } reviews)
              </em>
              <h3>₹{data?.product?.price}</h3>
              <article>
                {data?.product?.stock! > 0 ? (
                  <>
                    <div>
                      <button onClick={decrement}>-</button>
                      <span>{quantity}</span>
                      <button onClick={increment}>+</button>
                    </div>
                    <button
                      onClick={() =>
                        addToCartHandler({
                          productId: data?.product?._id!,
                          name: data?.product?.name!,
                          price: data?.product?.price!,
                          stock: data?.product?.stock!,
                          quantity,
                          photo: data?.product?.photos[0].url || "",
                        })
                      }
                    >
                      Add To Cart
                    </button>
                  </>
                ) : (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    Item is out of stock
                  </p>
                )}
              </article>

              <p>{data?.product?.description}</p>
            </section>
          </main>
        </>
      )}

      <dialog ref={reviewDialogRef} className="review-dialog">
        <button onClick={reviewCloseHandler}>X</button>
        <h2>Write a Review</h2>
        <form onSubmit={submitReview}>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Review..."
          ></textarea>
          <RatingsEditable />
          <button disabled={reviewSubmitLoading} type="submit">
            Submit
          </button>
        </form>
      </dialog>

      <section>
        <article>
          <h2>Reviews</h2>

          {reviewsResponse.isLoading
            ? null
            : user && (
                <button onClick={showDialog}>
                  <FiEdit />
                </button>
              )}
        </article>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            overflowX: "auto",
            padding: "2rem",
          }}
        >
          {reviewsResponse.isLoading ? (
            <>
              <Skeleton width="45rem" length={5} />
              <Skeleton width="45rem" length={5} />
              <Skeleton width="45rem" length={5} />
            </>
          ) : (
            reviewsResponse.data?.reviews.map((review) => (
              <ReviewCard
                handleDeleteReview={handleDeleteReview}
                userId={user?._id}
                key={review._id}
                review={review}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ReviewCard = ({
  review,
  userId,
  handleDeleteReview,
}: {
  userId?: string;
  review: Review;
  handleDeleteReview: (reviewId: string) => void;
}) => (
  <div className="review">
    <RatingsComponent value={review.rating} />
    <p>{review.comment}</p>
    <div>
      <img src={review.user.photo} alt="User" />
      <small>{review.user.name}</small>
    </div>
    {userId === review.user._id && (
      <button onClick={() => handleDeleteReview(review._id)}>
        <FaTrash />
      </button>
    )}
  </div>
);

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #ddd",
        padding: "2rem",
      }}
    >
      <Skeleton width="50%" length={6} />
      <Skeleton width="50%" length={6} />
    </div>
  );
};

const NextButton:CarouselButtonType = ({ onClick }) => (
  <button
    style={{ position: "absolute", top: "50%", right: 0 }}
    onClick={onClick}
  >
    <FaArrowRightLong />
  </button>
);

const PrevButton:CarouselButtonType = ({ onClick }) => (
  <button
    style={{ position: "absolute", top: "50%", left: 0 }}
    onClick={onClick}
  >
    <FaArrowLeftLong />
  </button>
);

export default ProductDetails;
