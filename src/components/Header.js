import { useEffect, useState, useContext } from "react";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FOOD_STDUIO_LOGO } from "./Config";
import { auth } from "../firebase";
import PathContext from "../utils/PathContext";

const Header = () => {
  const { currentPath } = useContext(PathContext);

  const [userName, setUserName] = useState(null);

  // Subscribe to the redux store
  const cartItems = useSelector((store) => store.cart.cartItems);
  const path = "/signup";

  // console.log("Header rendering");
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // console.log(user);
      if (user != null) {
        // console.log(user.displayName);
        if (!user.displayName) {
          await user.reload();
        }
        setUserName(user.displayName);
      } else {
        setUserName(null);
      }
    });

    return () => {
      unsubscribe();
    };
  });

  const handleClick = () => {
    // console.log("log out");
    auth.signOut();
    // setUser(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="lg:flex  lg:p-[13px] flex items-center justify-evenly lg:w-full lg:justify-between ">
        <a
          className="lg:w-[50px] lg:h-[50px] lg:overflow-hidden lg:rounded-full lg:flex lg:justify-center"
          href="/"
        >
          <img
            className="max-w-full max-h-full w-[100px]  object-cover"
            src={FOOD_STDUIO_LOGO}
            alt=""
          />
        </a>

        <div className="flex justify-end items-center ">
          <ul className="list-none flex justify-between m-0 p-0">
            <li className="font-Arvo p-[10px] text-[12px] lg:text-[20px]">
              <Link to="/">Home</Link>
            </li>

            <li className="font-Arvo p-[10px] text-[12px] lg:text-[20px]">
              <Link to="/contact">Contact</Link>
            </li>
            <li className="font-Arvo p-[10px] text-[12px] lg:text-[20px]">
              <Link to="/cart">
                Cart <span>({cartItems.items.length})</span>
              </Link>
            </li>
          </ul>
          <div className="flex items-center">
            {!userName ? (
              <Link to={path}>
                <button className=" bg-inherit border-2 border-black rounded p-1 font-Arvo text-[12px]  lg:text-[18px] h-[37px]">
                  Login
                </button>
              </Link>
            ) : (
              <div className="flex flex-row justify-between items-center">
                <h1 className="m-1 border-2 bg-gray-400 rounded p-1 font-Arvo text-[18px] h-[37px]">
                  Welcome {userName}
                </h1>
                <button
                  className="bg-inherit border-2 border-black rounded p-1 font-Arvo text-[18px] h-[37px]"
                  onClick={() => handleClick()}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="-ml-[400px]">{currentPath === "/" && <SearchBar />}</div>
    </div>
  );
};

export default Header;
