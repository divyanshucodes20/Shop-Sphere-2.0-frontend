import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ReusableProductCard from "../components/reusable-product-card";
import { useGetAllReusableCategoriesQuery, useSearchReusableProductsQuery } from "../redux/api/reusableAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItem } from "../types/types";

const ReusableSearch = () => {
  const searchQuery = useSearchParams()[0];
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError: categoriesError,
    error: categoriesErrorResponse,
  } = useGetAllReusableCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productError,
    error: productErrorResponse,
  } = useSearchReusableProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const dispatch = useDispatch();

  const addToCartHandler = async (cartItem: CartItem) => {
    if (!cartItem || typeof cartItem.stock !== "number") {
      return toast.error("Invalid product details");
    }
    try {
      dispatch(addToCart(cartItem));
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };
  

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (categoriesError && categoriesErrorResponse) {
    const err = categoriesErrorResponse as CustomError;
    const errorMessage = err?.data?.message || "Failed to load categories.";
    toast.error(errorMessage);
    console.error("Categories error:", categoriesErrorResponse);
  }

  if (productError && productErrorResponse) {
    const err = productErrorResponse as CustomError;
    const errorMessage = err?.data?.message || "Failed to load products.";
    toast.error(errorMessage);
    console.error("Product search error:", productErrorResponse);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Resuable Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((i) => (
  <ReusableProductCard
    key={i._id}
    productId={i._id}
    name={i.productDetails.name}
    price={i.totalPrice}
    stock={i.productDetails.stock}
    photos={i.productDetails.photos}
    handler={async () => {
      await addToCartHandler(
        {
          productId: i._id,
          name: i.productDetails.name,
          price: i.totalPrice,
          stock: i.productDetails.stock,
          quantity: 1,
          photo: i.productDetails.photos[0]?.url || "",
        }
      );
    }}
  />
))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default ReusableSearch;
