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
import { useGetAdminReusableProductsQuery } from "../../redux/api/reusableAPI";

interface DataType {
  photo: ReactElement;
  name: string;
  TotalPrice: number;
  stock: number;
  userId: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header:"User",
    accessor:"userId"
  },
  {
    Header: "Total Price",
    accessor: "TotalPrice",
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

const AdminReusableProducts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, isError, error, data } = useGetAdminReusableProductsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.products.map((i) => ({
          photo: <img src={i.productDetails.photos?.[0]?.url} />,
          name: i.productDetails.name,
          userId: i.userId,
          TotalPrice: i.totalPrice,
          stock: i.productDetails.stock,
          action: <Link to={`/admin/reusable/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default AdminReusableProducts;

