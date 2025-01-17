import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import videoCover from "../assets/videos/cover.mp4";
import { FaAnglesDown, FaHeadset } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Slider } from "6pp";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import { RootState, server } from "../redux/store";
import { useGetLatestReusableProductsQuery } from "../redux/api/reusableAPI";
import ReusableProductCard from "../components/reusable-product-card";

const clients = [
  {
    src: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
    alt: "react",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
    alt: "node",
  },
  {
    src: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
    alt: "mongodb",
  },
  {
    src: "https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg",
    alt: "express",
  },
  {
    src: "https://www.vectorlogo.zone/logos/js_redux/js_redux-ar21.svg",
    alt: "redux",
  },
  {
    src: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg",
    alt: "typescript",
  },
  {
    src: "https://www.vectorlogo.zone/logos/sass-lang/sass-lang-ar21.svg",
    alt: "sass",
  },
  {
    src: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg",
    alt: "firebase",
  },
  {
    src: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg",
    alt: "figma",
  },

  {
    src: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
    alt: "github",
  },

  {
    src: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg",
    alt: "Docker",
  },
  {
    src: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg",
    alt: "Kubernetes",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nestjs/nestjs-ar21.svg",
    alt: "Nest.js",
  },

  {
    src: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg",
    alt: "GraphQL",
  },

  {
    src: "https://www.vectorlogo.zone/logos/jestjsio/jestjsio-ar21.svg",
    alt: "Jest",
  },

  {
    src: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg",
    alt: "Redis",
  },

  {
    src: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
    alt: "PostgreSQL",
  },
  {
    src: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg",
    alt: "Jenkins",
  },
];

const banners = [
  "https://res.cloudinary.com/dmwfyn2op/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1732734495/fotor-ai-2024112803637_f7eyko.jpg",
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253445/rmbjpuzctjdbtt8hewaz.png",
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/ticeufjqvf6napjhdiee.png"
];
const categories = [
  "Electronics",
  "Mobiles",
  "Laptops",
  "Books",
  "Fashion",
  "Appliances",
  "Furniture",
  "Home Decor",
  "Grocery",
  "Beauty",
  "Toys",
  "Fitness",
];

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

const Home = () => {
  const { data, isError, isLoading } = useLatestProductsQuery("");

  const {user}=useSelector((state:RootState)=>state.userReducer)

  const {
    data:reusableData,
    isError:reusableIsError,
    isLoading:reusableIsLoading
  }=useGetLatestReusableProductsQuery("")

  const dispatch = useDispatch();

  const addToCartHandler = async (cartItem: CartItem) => {
    // Check if cartItem exists and has valid stock information
    if (!cartItem || typeof cartItem.stock !== "number") {
      return toast.error("Invalid product details");
    }
  
    // If the product is out of stock, call the notification API
    if (cartItem.stock < 1) {
      try {
        const response = await fetch(`${server}/api/v1/notification/new?userId=${user?._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: cartItem.productId,
            email: user?.email, // Use user?.email directly
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          return toast.error(data.message || "Failed to create notification.");
        }
  
        return toast.error(
          "Out of stock! You will be notified when the product is back in stock."
        );
      } catch (error) {
        console.error("Error creating notification:", error);
        return toast.error("An error occurred. Please try again.");
      }
    }
  
    // Add to cart if the product is in stock
    try {
      dispatch(addToCart(cartItem));
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };
  

  if (isError) toast.error("Cannot Fetch the Products");

  if(reusableIsError) toast.error("Cannot Fetch the Reusable Products");

  const coverMessage =
    "Fashion isn't just clothes; it's a vibrant language. Silhouettes and textures speak volumes, a conversation starter with every bold print. It's a way to tell our story, a confidence booster, or a playful exploration. From elegance to rebellion, fashion lets us navigate the world in style.".split(
      " "
    );

  return (
    <>
      <div className="home">
        <section></section>

        <div>
          <aside>
            <h1>Categories</h1>
            <ul>
              {categories.map((i) => (
                <li key={i}>
                  <Link to={`/search?category=${i.toLowerCase()}`}>{i}</Link>
                </li>
              ))}
            </ul>
          </aside>
          <Slider
            autoplay
            autoplayDuration={1500}
            showNav={false}
            images={banners}
          />
        </div>
        <b>Read About Us Before Shopping or selling </b>
        <Link
  to="/about"
  style={{
    display: "inline-block",
    padding: "0.8rem 1rem",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#2d89ff",
    textDecoration: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "1rem",
    width:"30%",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056d6")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2d89ff")}
>
  About Us
</Link>
        <h1>
          Latest Products
          <Link to="/search" className="findmore">
            More
          </Link>
        </h1>
        <main>
          {isLoading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                photos={i.photos}
                handler={async () => {
                  await addToCartHandler(
                    {
                      productId: i._id,
                      name: i.name,
                      price: i.price,
                      stock: i.stock,
                      quantity: 1, // Default quantity for now
                      photo: i.photos[0]?.url || "",
                    }
                  );
                }}
              />
            ))
          )}
        </main>
        <h1>
          Latest Reusable Products
          <Link to="/reusable-search" className="findmore">
            More
          </Link>
        </h1>
        <main>
          {reusableIsLoading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>
          ) : (
            reusableData?.products.map((i) => (
              <ReusableProductCard
                key={i._id}
                productId={i._id}
                name={i.productDetails.name||""}
                price={i.totalPrice||0}
                stock={i.productDetails.stock||0}
                photos={i.productDetails.photos||[]}
                handler={async () => {
                  await addToCartHandler(
                    {
                      productId: i._id,
                      name: i.productDetails.name,
                      price: i.totalPrice,
                      stock: i.productDetails.stock,
                      quantity: 1,
                      photo: i.productDetails.photos[0]?.url || "",
                    }
                  );
                }}
              />
            ))
          )}
        </main>
      </div>

      <article className="cover-video-container">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={videoCover} />
        <div className="cover-video-content">
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Fashion
          </motion.h2>
          {coverMessage.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          }}
        >
          <FaAnglesDown />
        </motion.span>
      </article>

      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: -100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: clients.length / 20,
              },
            }}
          >
            Trusted By 100+ Companies in 30+ countries
          </motion.p>
        </div>
      </article>

      <hr
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "none",
          height: "1px",
        }}
      />

      <article className="our-services">
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}Y</h3>
                <p>{service.title}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
    </>
  );
};

export default Home;