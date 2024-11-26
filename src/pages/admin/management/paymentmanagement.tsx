import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { RootState } from "../../../redux/store";
import { UserPayment } from "../../../types/types";
import { responseToast} from "../../../utils/features";
import { useGetPaymentByIdQuery, useProcessPaymentMutation } from "../../../redux/api/userPaymentAPI";

const defaultData: UserPayment = {
    userId:"",
    reusableProductId:"",
    amount:0,
    paymentStatus:"pending",
    _id:"",
};

const PaymentManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams();
  const navigate = useNavigate();

  const { isLoading, data, isError } = useGetPaymentByIdQuery({userId:user?._id!,paymentId:params.id!});

  const {
    userId,
    reusableProductId,
    amount,
    paymentStatus,
    _id,    
  } = data?.payment || defaultData;
  const [updateQueryStatus] = useProcessPaymentMutation();

  const updateHandler = async () => {
    const res = await updateQueryStatus({
      userId: user?._id!,
      paymentId: _id!,
    });
    responseToast(res, navigate, "/admin/payments");
  };


  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>

            <article className="shipping-info-card">
              <h1>Payment Info</h1>
              <h5>User Info:</h5>
              <p><b>UserId:</b> {userId}</p>
              <p>
               <b>Resuable ProductId: </b>
                {reusableProductId} 
              </p>
              <p>
               <b>Amount To Pay: </b>
                {amount} 
              </p>
              <h5>Status Info:</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    paymentStatus === "pending"
                      ? "red":"green"
                  }
                >
                  {paymentStatus}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Mark as Completed
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};
export default PaymentManagement;
