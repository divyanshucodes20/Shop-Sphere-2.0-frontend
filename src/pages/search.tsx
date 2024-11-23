import { useState } from "react";
import ProductCard from "../components/product-card";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RootState, server } from "../redux/store";

const Search = () => {
  const searchQuery = useSearchParams()[0];
  const { user } = useSelector((state: RootState) => state.userReducer);
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError: categoriesError,
    error: categoriesErrorResponse,
  } = useCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productError,
    error: productErrorResponse,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const dispatch = useDispatch();

  const addToCartHandler = async (cartItem: CartItem) => {
    // Check if cartItem exists and has valid stock information
    if (!cartItem || typeof cartItem.stock !== "number") {
      return toast.error("Invalid product details");
    }
  
    // If the product is out of stock, call the notification API
    if (cartItem.stock < 1) {
      try {
        const response = await fetch(`${server}/api/v1/notification/new?userId=${user?._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: cartItem.productId,
            email: user?.email, // Use user?.email directly
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
  
    // Add to cart if the product is in stock
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
        <h1>Products</h1>
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
  <ProductCard
    key={i._id}
    productId={i._id}
    name={i.name}
    price={i.price}
    stock={i.stock}
    photos={i.photos}
    handler={async () => {
      await addToCartHandler(
        {
          productId: i._id,
          name: i.name,
          price: i.price,
          stock: i.stock,
          quantity: 1, // Default quantity for now
          photo: i.photos[0]?.url || "",
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

export default Search;
