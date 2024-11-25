import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { useGetAdminPendingReUsableProductsQuery } from "../../redux/api/queryAPI";

interface DataType {
  user: string;
  price: number;
  stock: number;
  name: string;
  category: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "UserId",
    accessor: "user",
  },
  {
    Header: "Product",
    accessor: "name",
  },
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const AdminPendingReusable = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError, error } = useGetAdminPendingReUsableProductsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.queries.map((i) => ({
          user: i.userId,
          name:i.productDetails.name,
          category:i.productDetails.category,
          price: i.productDetails.price,
          stock: i.productDetails.stock,
          action: <Link to={`/admin/pending-reusable/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Pickups",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default AdminPendingReusable;
