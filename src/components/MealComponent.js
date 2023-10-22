import { useState, useContext, useEffect } from "react";
import { IMG_CDN_URL } from "./Config";
import { useDispatch, useSelector } from "react-redux";
import { checkAvailability, findQuantity, removeMenu } from "../utils/utils";
import { useParams } from "react-router-dom";
import RestaurantContext from "../utils/RestaurantContext";

const MealComponent = (curMenu) => {
  // Destructure props
  const { name, price, description, imageId } = curMenu?.curMenu?.card?.info;

  // State variables
  const [itemQuantity, setItemQuantity] = useState(0);

  // Read data from context API
  const myData = useContext(RestaurantContext);

  // Fetch the ID of the opened restaurant
  const { id } = useParams();

  // Cart operations
  // Subscribe to cart
  const cartItems = useSelector((store) => store.cart.cartItems);
  // Push to cart
  const dispatch = useDispatch();

  // Action functions
  const handleAdd = (meal) => {
    const check = checkAvailability(id, meal, cartItems, dispatch, myData);
    if (check) {
      setItemQuantity(itemQuantity + 1);
    }
  };

  const handleRemove = (meal) => {
    removeMenu(meal, cartItems, dispatch);
    setItemQuantity(Math.max(0, itemQuantity - 1));
  };

  useEffect(() => {
    setItemQuantity(findQuantity(curMenu?.curMenu?.card?.info?.id, cartItems));
  }, []);

  return (
    <>
      <div className="flex p-2 items-center sm:flex-col md:flex-row lg:flex-row">
        <div className="w-full mb-2 sm:w-full md:w-80 lg:w-80 px-2 sm:px-2 md:px-10 lg:px-10">
          <h4 className="mt-0 mb-2">{name}</h4>
          <h5 className="my-2 text-[#5e5d5d]">{price / 100}Rs</h5>
          <p className="my-2 text-[#8d8d8d]">{description}</p>
        </div>
        <div className="relative w-full lg:w-40 text-center px-2 sm:px-2 md:px-10 lg:px-10 overflow-hidden">
          {imageId ? (
            <img
              className="min-w-full max-w-full object-fill rounded-md"
              src={IMG_CDN_URL + imageId}
              alt="meal-image"
            />
          ) : (
            <></>
          )}
          <div className="flex justify-evenly rounded">
            <button
              className="text-sm text-white p-1 transform transition duration-300 hover:scale-125"
              onClick={() => handleRemove(curMenu?.curMenu?.card?.info)}
            >
              ➖
            </button>

            <h1 className="p-1">{itemQuantity}</h1>

            <button
              className="text-sm text-white p-1 transform transition duration-300 hover:scale-125"
              onClick={() => handleAdd(curMenu?.curMenu?.card?.info)}
            >
              ➕
            </button>
          </div>
        </div>
      </div>
      <hr className="w-full" />
    </>
  );
};

export default MealComponent;
