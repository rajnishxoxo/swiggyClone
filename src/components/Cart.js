import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { addItem, clearCart, removeItem } from "../utils/cartSlice";
import { IMG_CDN_URL } from "./Config";
import { auth, database } from "../firebase";
import PathContext from "../utils/PathContext";
import { emptyCartImageURL } from "../utils/utils";

const Cart = () => {
  //------------------------------------------- Initialisation area ---------------------------------------
  // State variables
  const [totalBill, setTotalBill] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  // Subscribe to items array of cart slice in the store.
  const cartItems = useSelector((store) => store.cart.cartItems);

  //path will take you to respective restaurnat menu.
  const path = "/restaurant/" + cartItems.restaurant_id;

  const { setCurrentPath } = useContext(PathContext);
  const { pathname } = useLocation();

  //--------------------------------------- useEffects --------------------------------------------------
  useEffect(() => {
    setCurrentPath(pathname);
  }, []);

  useEffect(() => {
    let total = 0;
    cartItems.items.forEach((cur) => {
      if (cur.price != "NaN") total += (cur.price / 100) * cur.quantity;
    });
    total.toFixed(2);
    setTotalBill(total);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //--------------------------------------- Cart modifications ------------------------------------------

  const dispatch = useDispatch();
  const store = useStore();

  // Add menu in cart
  const addMenu = (curItem) => {
    dispatch(addItem(curItem));
    setTotalBill(totalBill + curItem.price / 100);
  };

  //remove menu
  const removeMenu = (curItem) => {
    dispatch(removeItem(curItem));
    const bill = Math.max(0, totalBill - curItem.price / 100);
    setTotalBill(bill);
  };

  //---------------------------------------- Checkout -> Push data to Firebase RTDB -----------------------

  const handleClick = () => {
    //check if user is logged in.
    if (!currentUser) {
      alert("Please Login/Sign up first to place an order");
      return;
    }

    //fetch cart items from redux store.
    const cartState = store.getState().cart;
    const cartItems = cartState.cartItems;

    //user details
    const uid = currentUser.uid;
    const databaseRef = database.ref("users/" + uid);
    const newChildRef = databaseRef.push();
    newChildRef.set(cartItems);

    alert("Order Successful");
    dispatch(clearCart());
  };

  //---------------------------------------- Rendering area -----------------------------------------------

  return (
    <>
      <div className="flex bg-slate-200 px-4 min-h-screen mx-auto">
        {/* account details side */}

        {/* Cart details side */}
        {cartItems.items.length > 0 ? (
          <div className="bg-white w-[80%] h-[70vh] p-4 my-8 mx-4 ">
            {/* restaurant details */}
            <div className="flex">
              <div className="w-16 h-12 mx-2 overflow-hidden">
                <Link to={path}>
                  <img
                    className="min-h-full max-h-full object-fill rounded"
                    src={IMG_CDN_URL + cartItems.logo}
                    alt=""
                  />
                </Link>
              </div>
              <div className="mx-2">
                <h3 className="text-lg font-Arvo">
                  {cartItems.restaurantName}
                </h3>
                <h4 className="text-sm">{cartItems.areaName}</h4>
              </div>
            </div>

            {/* menu items list */}
            {/* Title, buttons to change quantity, price per piece */}
            <div className="h-[35vh] overflow-y-auto mt-4">
              {cartItems.items.map((curItem) => {
                return (
                  <div className="my-4 flex justify-between items-center">
                    <h3 className="w-[40%] font-Arvo">{curItem.name}</h3>
                    <div className="w-[35%] flex justify-between items-center border border-gray-400 px-2 mx-2">
                      <button onClick={() => removeMenu(curItem)}>➖</button>

                      <h4 className="mx-1 font-Arvo">{curItem.quantity}</h4>

                      <button onClick={() => addMenu(curItem)}>➕</button>
                    </div>
                    <p className="w-[25%] text-end font-Arvo">
                      {(curItem.price / 100) * curItem.quantity}Rs
                    </p>
                  </div>
                );
              })}
            </div>
            {/* Total Charge */}

            <div className="mt-2 p-2 flex justify-between ">
              <h3 className="font-bold">Total Amount to Pay:</h3>
              <h3 className="font-semibold">{totalBill}Rs</h3>
            </div>

            <div className="flex justify-between my-1">
              <button
                className="bg-green-600 text-white font-Arvo p-1 rounded"
                onClick={() => {
                  dispatch(clearCart());
                }}
              >
                Clear Cart
              </button>
              <button
                className="bg-green-600 text-white font-Arvo p-1 rounded"
                onClick={handleClick}
              >
                CheckOut
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-evenly items-center">
            <h1 className=" text-center font-Arvo text-xl">
              Your Card is Empty 😔
            </h1>
            <p className="text-center font-Arvo text-xl">
              Please Add Some Food 🥘
            </p>
            <img
              className="lg:w-2/5  rounded-lg w-[400px]"
              src={emptyCartImageURL}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
