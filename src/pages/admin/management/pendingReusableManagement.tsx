import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { useNewReusableProductMutation,useDeleteReusableProductMutation  } from "../../../redux/api/reusableAPI";
import { RootState } from "../../../redux/store";
import { Query } from "../../../types/types";
import { responseToast, transformImage } from "../../../utils/features";
import { useState } from "react";
import { useGetQueryByIdQuery } from "../../../redux/api/queryAPI";

const defaultData: Query = {
  userId: "",
  productDetails: {
    name: "",
    category: "",
    description: "",
    price: 0,
    stock: 0,
    photos: [],
  },
  queryStatus: "pending",
  pickupDetails: {
    pickupAddress: "",
    pickupCity: "",
    pickupPostalCode: "",
  },
  _id: "",
};

const PendingReusableManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams();
  const navigate = useNavigate();

  const { isLoading, data, isError } = useGetQueryByIdQuery(params.id!);

  const {
    userId,
    productDetails,
    queryStatus,
    pickupDetails,
    _id,
  } = data?.query || defaultData;

  const [deleteReusableProduct]=useDeleteReusableProductMutation();

  const [createReusableProduct] = useNewReusableProductMutation();
  const [commission, setCommission] = useState<number>(0);

  const deleteHandler = async () => {
    const res = await deleteReusableProduct({
      userId: user?._id!,
      id: _id!,
    });
    responseToast(res, navigate, "/admin/pending-reusable");
  };

  const createReusableHandler = async () => {
    if (commission <0) {
      alert("Commission is required and must be greater than or equal 0.");
      return;
    }
    if(commission==0){
    const res=window.confirm("Commission is 0 are you sure you want to proceed?");
    if(!res){
      return;
    } 
    }

    const formData = new FormData();
  formData.append("userId", userId);
  formData.append("commission", commission.toString());
  formData.append("productDetails", JSON.stringify(productDetails));

    const res = await createReusableProduct({ formData,id: user?._id! });
    responseToast(res, navigate, "/admin/reusable-products");
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section
              style={{
                padding: "2rem",
              }}
            >
              <h2>Product Photos</h2>
                {productDetails &&
                productDetails.photos.map((photo: { url: string }, index: number) => (
                  <img key={index} src={transformImage(photo.url)} alt="product" />
                ))}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Query Info</h1>
              <h5>Product Info:</h5>
              <p>
                <b>Name:</b> {productDetails.name}
                <br />
                <b>Category:</b> {productDetails.category}
                <br />
                <b>Price:</b> {productDetails.price}
                <br />
                <b>Stock:</b> {productDetails.stock}
                <br />
                <b>Description:</b> {productDetails.description}
              </p>
              <h5>User Info:</h5>
              <p>
                <b>UserId:</b> {userId}
              </p>
              <p>
                <b>Pickup Address: </b> {pickupDetails.pickupAddress}
                <br />
                <b>Pickup City: </b> {pickupDetails.pickupCity}
                <br />
                <b>Pickup PostalCode: </b> {pickupDetails.pickupPostalCode}
              </p>
              <h5>Enter Product Commission:</h5>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                style={{
                  padding: "0.5rem",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                  marginBottom: "1rem",
                }}
                placeholder="Enter commission amount"
                required
              />
              <h5>Status Info:</h5>
              <p>
                Status:{" "}
                <span className={queryStatus === "pending" ? "red" : "green"}>
                  {queryStatus}
                </span>
              </p>
              <button className="shipping-btn" onClick={createReusableHandler}>
                Create Reusable Product
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default PendingReusableManagement;
