import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import { RootState } from "../../redux/store";
import { useGetAdminAllPaymentsQuery, useGetAdminCompletedPaymentsQuery, useGetAdminPendingPaymentsQuery } from "../../redux/api/userPaymentAPI";
import { Link } from "react-router-dom";
import { CustomError } from "../../types/api-types";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";

type DataType = {
  _id: string;
  amount: number;
  reusableProductId: string;
  status: ReactElement;
  action: ReactElement;
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
  {
    Header: "Action",
    accessor: "action",
  }
];

const AdminPayments = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading: isAllLoading, data: allData, isError: isAllError, error: allError } = useGetAdminAllPaymentsQuery(user?._id!);
  const { isLoading: isPendingLoading, data: pendingData } = useGetAdminPendingPaymentsQuery(user?._id!);
  const { isLoading: isCompletedLoading, data: completedData } = useGetAdminCompletedPaymentsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);
  const [filter, setFilter] = useState<string>("All");

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  useEffect(() => {
    const filteredData =
      filter === "Pending" ? pendingData : 
      filter === "Completed" ? completedData : 
      allData;
  
    if (filteredData) {
      setRows(
        filteredData.payments.map((i) => ({
          _id: i._id,
          amount: i.amount,
          reusableProductId: i.reusableProductId,
          status: (
            <span className={i.paymentStatus === "pending" ? "red" : "green"}>
              {i.paymentStatus}
            </span>
          ),
          action: <Link to={`/admin/payments/${i._id}`}>Manage</Link>,
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
      <h1>All Payments</h1>
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

export default AdminPayments;
