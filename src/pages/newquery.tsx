import { useFileHandler } from "6pp";
import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useNewQueryMutation } from "../redux/api/queryAPI";
import { responseToast } from "../utils/features";
import toast from "react-hot-toast";

const NewQuery = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const navigate = useNavigate();

  if(user?.role !== "user"){
    toast.error("You are not authorized to view this page");
    navigate("/");
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [pickupCity, setPickupCity] = useState<string>("");
  const [pickupPostalCode, setPickupPostalCode] = useState<string>("");

  const [newQuery] = useNewQueryMutation();

  const photos = useFileHandler("multiple", 10, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!name || !category || !description || !price || stock < 0) {
        throw new Error("All product details are required");
      }
      if (!pickupAddress || !pickupCity || !pickupPostalCode) {
        throw new Error("Pickup address and city are required");
      }
      if (!photos.file || photos.file.length === 0) {
        throw new Error("Please add at least one photo");
      }
      if (photos.file.length > 5) {
        throw new Error("You can only upload up to 5 photos");
      }

      // Prepare form data
      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);
      formData.set("pickupAddress", pickupAddress);
      formData.set("pickupCity", pickupCity);
      formData.set("pickupPostalCode", pickupPostalCode);

      photos.file.forEach((file) => {
        formData.append("photos", file);
      });

      // Call the mutation
      const res = await newQuery({ formData, userId: user?._id! });

      responseToast(res, navigate, "/user/queries");
    } catch (error: any) {
      console.error(error);
      responseToast(
        error.message || "Something went wrong",
        navigate,"/user/queries"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newcontainer">
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Query</h2>

            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="e.g., laptop, camera, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Pickup Address</label>
              <input
                required
                type="text"
                placeholder="Pickup Address"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
              />
            </div>

            <div>
              <label>Pickup City</label>
              <input
                required
                type="text"
                placeholder="Pickup City"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
              />
            </div>

            <div>
              <label>Pickup Postal Code</label>
              <input
                required
                type="text"
                placeholder="Pickup Postal Code"
                value={pickupPostalCode}
                onChange={(e) => setPickupPostalCode(e.target.value)}
              />
            </div>

            <div>
              <label>Photos</label>
              <input
                required
                type="file"
                accept="image/*"
                multiple
                onChange={photos.changeHandler}
              />
            </div>

            {photos.error && <p>{photos.error}</p>}

            {photos.preview &&
              photos.preview.map((img, i) => (
                <img key={i} src={img} alt="New Image" />
              ))}

            <button disabled={isLoading} type="submit">
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewQuery;
