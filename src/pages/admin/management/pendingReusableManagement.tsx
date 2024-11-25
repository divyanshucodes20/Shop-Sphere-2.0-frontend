import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { useDeleteQueryMutation, useGetQueryByIdQuery, useUpdateQueryStatusMutation } from "../../../redux/api/queryAPI";
import { RootState } from "../../../redux/store";
import { Query } from "../../../types/types";
import { responseToast, transformImage } from "../../../utils/features";

const defaultData: Query = {
    userId:"",
    productDetails:{
      name:"",
      category:"",
      description:"",
      price:0,
      stock:0,
      photos:[],
    },
    queryStatus:"pending",
    pickupDetails: {
      pickupAddress:"",
      pickupCity:"",
      pickupPostalCode:"",
    },
    _id:"",
};

const QueryManagement = () => {
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

  const [updateQueryStatus] = useUpdateQueryStatusMutation();
  const [deleteQuery] = useDeleteQueryMutation();

  const updateHandler = async () => {
    const res = await updateQueryStatus({
      userId: user?._id!,
      id: _id!,
    });
    responseToast(res, navigate, "/admin/queries");
  };

  const deleteHandler = async () => {
    const res = await deleteQuery({
      userId: user?._id!,
        id: _id!,
    });
    responseToast(res, navigate, "/admin/queries");
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
  {productDetails && (
    productDetails.photos.map((photo, index) => <img key={index} src={transformImage(photo.url)} alt="product"/>)
  )}
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
                <b>Description:</b> {productDetails.description}
              </p>
              <h5>User Info:</h5>
              <p><b>UserId:</b> {userId}</p>
              <p>
               <b>Pickup Address: </b> {pickupDetails.pickupAddress}
               <br />
               <b>Pickup City: </b> :{pickupDetails.pickupCity},
                <br />
                <b>Pickup PostalCode: </b> {pickupDetails.pickupPostalCode},
              </p>
              <h5>Status Info:</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    queryStatus === "pending"
                      ? "red":"green"
                  }
                >
                  {queryStatus}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Accept Query
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};
export default QueryManagement;
