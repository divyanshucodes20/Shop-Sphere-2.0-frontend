import { useFileHandler } from "6pp";
import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { useDeleteQueryMutation, useGetQueryByIdQuery, useUpdateUserQueryMutation } from "../redux/api/queryAPI";
import { responseToast, transformImage } from "../utils/features";
import { Skeleton } from "../components/loader";

const Querymanagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetQueryByIdQuery(params.id!);

  const { price, photos, name, stock, category, description } =
    data?.query.productDetails || {
      photos: [],
      category: "",
      name: "",
      stock: 0,
      price: 0,
      description: "",
    };
    const {pickupAddress,pickupCity,pickupPostalCode}=data?.query.pickupDetails || {
      pickupAddress:"",
      pickupCity:"",
      pickupPostalCode:"",
    }

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);
 
  const[pickupAddressUpdate,setPickupAddressUpdate] = useState<string>(pickupAddress);

  const[pickupCityUpdate,setPickupCityUpdate] = useState<string>(pickupCity);

  const[pickupPostalCodeUpdate,setPickupPostalCodeUpdate] = useState<string>(pickupPostalCode);

  const [updateQuery] = useUpdateUserQueryMutation();
  const [deleteQuery] = useDeleteQueryMutation();

  const photosFiles = useFileHandler("multiple", 10, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBtnLoading(true);
    try {
      const formData = new FormData();

      if (nameUpdate) formData.set("name", nameUpdate);
      if (descriptionUpdate) formData.set("description", descriptionUpdate);
      if (priceUpdate) formData.set("price", priceUpdate.toString());
      if (stockUpdate !== undefined)
        formData.set("stock", stockUpdate.toString());

      if (categoryUpdate) formData.set("category", categoryUpdate);


      if(pickupAddressUpdate) formData.set("pickupAddress",pickupAddressUpdate);
      if(pickupCityUpdate) formData.set("pickupCity",pickupCityUpdate);
      if(pickupPostalCodeUpdate) formData.set("pickupPostalCode",pickupPostalCodeUpdate);

      if (photosFiles.file && photosFiles.file.length > 0) {
        photosFiles.file.forEach((file) => {
          formData.append("photos", file);
        });
      }

      const res = await updateQuery({
        formData,
        userId: user?._id!,
        id:data?.query._id!
      });

      responseToast(res, navigate, "/user/queries");
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async () => {
    const res = await deleteQuery({
      userId: user?._id!,
      id: data?.query._id!,
    });

    responseToast(res, navigate, "/user/queries");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.query.productDetails.name);
      setPriceUpdate(data.query.productDetails.price);
      setStockUpdate(data.query.productDetails.stock);
      setCategoryUpdate(data.query.productDetails.category);
      setDescriptionUpdate(data.query.productDetails.description);
      setPickupAddressUpdate(data.query.pickupDetails.pickupAddress);
      setPickupCityUpdate(data.query.pickupDetails.pickupCity);
      setPickupPostalCodeUpdate(data.query.pickupDetails.pickupPostalCode);
    }
  }, [data]);

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="newcontainer">
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.query._id}</strong>
              <img src={transformImage(photos[0]?.url)} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    required
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  /> </div>
                  <div>
                  <label>Pickup Address</label>
                  <input
                    type="text"
                    placeholder="Pickup Address"
                    value={pickupAddressUpdate}
                    onChange={(e) => setPickupAddressUpdate(e.target.value)}
                  />
                  </div>
                  <div>
                  <label>Pickup City</label>
                  <input
                    type="text"
                    placeholder="Pickup City"
                    value={pickupCityUpdate}
                    onChange={(e) => setPickupCityUpdate(e.target.value)}
                  />
                  </div>
                  <div>
                  <label>Pickup Postal Code</label>
                  <input
                    type="text"
                    placeholder="Pickup Postal Code"
                    value={pickupPostalCodeUpdate}
                    onChange={(e) => setPickupPostalCodeUpdate(e.target.value)}
                  />
                  </div>
                <div>
                  <label>Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={photosFiles.changeHandler}
                  />
                </div>

                {photosFiles.error && <p>{photosFiles.error}</p>}

                {photosFiles.preview && (
                  <div
                    style={{ display: "flex", gap: "1rem", overflowX: "auto" }}
                  >
                    {photosFiles.preview.map((img, i) => (
                      <img
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                        key={i}
                        src={img}
                        alt="New Image"
                      />
                    ))}
                  </div>
                )}

                <button disabled={btnLoading} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Querymanagement;
