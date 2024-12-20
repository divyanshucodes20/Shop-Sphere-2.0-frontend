import { onAuthStateChanged } from "firebase/auth";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/header";
import Loader, { LoaderLayout } from "./components/loader";
import ProtectedRoute from "./components/protected-route";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { RootState } from "./redux/store";
import Footer from "./components/footer";

const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const ThankYouPage = lazy(() => import("./pages/thankyou"));
const ContactUS = lazy(() => import("./pages/contact"));
const Search = lazy(() => import("./pages/search"));
const ReusableSearch = lazy(() => import("./pages/reusableSearch"));
const ProductDetails = lazy(() => import("./pages/product-details"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetails = lazy(() => import("./pages/order-details"));
const UserQueries = lazy(() => import("./pages/queries"));
const NewQuery = lazy(() => import("./pages/newquery"));
const Querymanagement = lazy(() => import("./pages/queryManagement"));
const NotFound = lazy(() => import("./pages/not-found"));
const Checkout = lazy(() => import("./pages/checkout"));
const UserPayments = lazy(() => import("./pages/userPayments"));

// Admin Routes Importing
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Discount = lazy(() => import("./pages/admin/discount"));
const ReStockAlert = lazy(() => import("./pages/admin/reStockAlert"));
const AdminQueries = lazy(() => import("./pages/admin/adminQueries"));
const QueryManagement = lazy(() => import("./pages/admin/management/querymanagement"));
const AdminPickups = lazy(() => import("./pages/admin/adminPickups"));
const  PickupManagement = lazy(() => import("./pages/admin/management/pickupManagement"));
const AdminPendingReusable = lazy(() => import("./pages/admin/adminPendingReusable"));
const PendingReusableManagement = lazy(() => import("./pages/admin/management/pendingReusableManagement"));
const AdminReusableProducts = lazy(() => import("./pages/admin/reusableProducts"));
const ReusableProductManagement = lazy(() => import("./pages/admin/management/reusableProductManagement"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ReusableProductDetails = lazy(() => import("./pages/reusableProductDetails"));
const AdminPayments = lazy(() => import("./pages/admin/adminPayments"));
const UserReusableProducts = lazy(() => import("./pages/userReusableProducts"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);
const DiscountManagement = lazy(
  () => import("./pages/admin/management/discountmanagement")
);
const PaymentManagement = lazy(
  () => import("./pages/admin/management/paymentmanagement")
);

const NewDiscount = lazy(() => import("./pages/admin/management/newdiscount"));

const App = () => {
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(userExist(data.user));
      } else dispatch(userNotExist());
    });
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      {/* Header */}
      <Header user={user} />
      <Suspense fallback={<LoaderLayout />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reusable-search" element={<ReusableSearch />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reusable/:id" element={<ReusableProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUS />} />
          <Route path="/thankyou" element={<ThankYouPage />} />
          {/* Not logged In Route */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />
          {/* Logged In User Routes */}
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />
            <Route path="/user/queries" element={<UserQueries />} />
            <Route path="/query/new" element={<NewQuery/>} />
            <Route path="/query/:id" element={<Querymanagement/>} />
            <Route path="/user/products" element={<UserReusableProducts />} />
            <Route path="/user/payments" element={<UserPayments />} />
          </Route>
          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin" ? true : false}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/discount" element={<Discount />} />
            <Route path="/admin/alerts" element={<ReStockAlert/>} />
            <Route path="/admin/queries" element={<AdminQueries/>} />
            <Route path="/admin/pickups" element={<AdminPickups/>} />
            <Route path="/admin/pending-reusable" element={<AdminPendingReusable/>} />
            <Route path="/admin/reusable" element={<AdminReusableProducts/>} />
            <Route path="/admin/payments" element={<AdminPayments/>} />
            
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route path="/admin/queries/:id" element={<QueryManagement/>} />
            <Route path="/admin/pickups/:id" element={<PickupManagement/>} />
            <Route path="/admin/pending-reusable/:id" element={<PendingReusableManagement/>} />
            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
             <Route
              path="/admin/reusable/:id"
              element={<ReusableProductManagement />}
            />
            <Route path="/admin/discount/new" element={<NewDiscount />} />
            <Route path="/admin/payments/:id" element={<PaymentManagement />} />
            <Route
              path="/admin/discount/:id"
              element={<DiscountManagement />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
