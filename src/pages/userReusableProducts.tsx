import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { Skeleton } from "../components/loader";
import { useGetUserReusableProductsQuery } from "../redux/api/reusableAPI";
import { RootState } from "../redux/store";
import { CustomError } from "../types/api-types";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  category: string;
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
    Header: "Your Price",
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
    Header: "Action",
    accessor: "action",
  }
];

const UserReusableProducts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);


const navigate=useNavigate();


  if(user?.role !== "user"){
    toast.error("You are not authorized to view this page");
    navigate("/");
  }



  const { isLoading, isError, error, data } = useGetUserReusableProductsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  };

  useEffect(() => {
    if (data) {
      setRows(
        data.products.map((query) => ({
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
          action: (
              <Link to={`/reusable/${query._id}`}>Details</Link>
            )
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Your Products",
    rows.length > 6
  )();

  return (
    <div className="container">
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default UserReusableProducts;
