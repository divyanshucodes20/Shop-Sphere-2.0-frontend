import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { Skeleton } from "../components/loader";
import { RootState } from "../redux/store";
import { CustomError } from "../types/api-types";
import {
  useGetUserAllPaymentsQuery,
  useGetUserCompletedPaymentsQuery,
  useGetUserPendingPaymentsQuery,
} from "../redux/api/userPaymentAPI";
import { useNavigate } from "react-router-dom";

type DataType = {
  _id: string;
  amount: number;
  reusableProductId: string;
  status: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Product_Id",
    accessor: "reusableProductId",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const userPayments = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);


  const navigate=useNavigate();

  if(user?.role !== "user"){
    toast.error("You are not authorized to view this page");
    navigate("/");
  }



  const { isLoading: isAllLoading, data: allData, isError: isAllError, error: allError } = useGetUserAllPaymentsQuery(user?._id!);
  const { isLoading: isPendingLoading, data: pendingData } = useGetUserPendingPaymentsQuery(user?._id!);
  const { isLoading: isCompletedLoading, data: completedData } = useGetUserCompletedPaymentsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);
  const [filter, setFilter] = useState<string>("All");

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  useEffect(() => {
    let data = allData;

    if (filter === "Pending") {
      data = pendingData;
    } else if (filter === "Completed") {
      data = completedData;
    }

    if (data) {
      setRows(
        data.payments.map((i) => ({
          _id: i._id,
          amount: i.amount,
          reusableProductId: i.reusableProductId,
          status: (
            <span
              className={
                i.paymentStatus === "pending"
                  ? "red"
                  : i.paymentStatus === "completed"
                  ? "green"
                  : "purple"
              }
            >
              {i.paymentStatus}
            </span>
          ),
        }))
      );
    }
  }, [allData, pendingData, completedData, filter]);

  if (isAllError) {
    const err = allError as CustomError;
    toast.error(err.data.message);
  }

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Payments",
    rows.length > 6
  )();
  return (
    <div className="container">
      <h1>My Payments</h1>
      <div style={{ marginBottom: "1rem" }}>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "1rem",
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      {isAllLoading || isPendingLoading || isCompletedLoading ? (
        <Skeleton length={20} />
      ) : (
        Table
      )}
    </div>
  );
};

export default userPayments;
