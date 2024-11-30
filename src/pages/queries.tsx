import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Column } from "react-table";
import { RootState } from "../redux/store";
import { useGetUserQueriesQuery } from "../redux/api/queryAPI";
import { CustomError } from "../types/api-types";
import TableHOC from "../components/admin/TableHOC";
import { Skeleton } from "../components/loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  category: string;
  id: string;
  action: ReactElement | string;
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
    Header: "Price",
    accessor: "price",
  },
  {
    Header:"Stock",
    accessor:"stock"
  },
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const UserQueries = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);


const navigate=useNavigate();


  if(user?.role !== "user"){
    toast.error("You are not authorized to view this page");
    navigate("/");
  }

  const { isLoading, isError, error, data } = useGetUserQueriesQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  };

  useEffect(() => {
    if (data) {
      setRows(
        data.queries.map((query) => ({
          photo: (
            <img
              src={query.productDetails.photos?.[0]?.url}
              alt={query.productDetails.name}
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          ),
          name: query.productDetails.name,
          price: query.productDetails.price,
          id: query._id,
          stock: query.productDetails.stock,
          category: query.productDetails.category,
          action:
            query.queryStatus === "pending" ? (
              <Link to={`/query/${query._id}`}>Manage</Link>
            ) : (
              <span
                style={{
                  color:
                    query.queryStatus === "approved"
                      ? "yellow"
                      : query.queryStatus === "success"
                      ? "green"
                      : "black",
                  fontWeight: "bold",
                }}
              >
                {query.queryStatus.charAt(0).toUpperCase() +
                  query.queryStatus.slice(1)}
              </span>
            ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Queries",
    rows.length > 6
  )();

  return (
    <div className="container">
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to="/query/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default UserQueries;
