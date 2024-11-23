import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { useDeleteNotificationMutation, useFetchNotificationsQuery } from "../../redux/api/notificationAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";

interface DataType {
  productName: string;
  productId: string;
  email: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Product Name",
    accessor: "productName",
  },
  {
    Header: "Product ID",
    accessor: "productId",
  },
  {
    Header: "User Email",
    accessor: "email",
  },
  {
    Header: "Action",
    accessor: "action",
  }
];

const ReStockAlert = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError, error } = useFetchNotificationsQuery(user?._id!);

  const [deleteNotification] = useDeleteNotificationMutation();

  const [rows, setRows] = useState<DataType[]>([]);

  const deleteHandler = async (productId: string, email: string) => {
    await deleteNotification({
      userId: user?._id!,
      productId,
      email,
    });
    setRows((prevRows) => prevRows.filter((row) => row.productId !== productId));
    toast.success("Notification deleted successfully");
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data) {
      setRows(
        data.notifications.map((notification) => ({
          productName: notification.productName,
          productId: notification.productId,
          email: notification.email,
          action: (
            <button onClick={() => deleteHandler(notification.productId, notification.email)}>
              <FaTrash />
            </button>
          ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Notifications",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default ReStockAlert;
