import React, { useState, useEffect, useContext } from "react";
import { MdOutlineDisplaySettings } from "react-icons/md";
import { LuMessagesSquare, LuSettings2 } from "react-icons/lu";
import { TbCategoryPlus } from "react-icons/tb";
import { CiShoppingCart } from "react-icons/ci";
import { PiSealPercentLight } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { CiGift } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import api from "../config/axiosConfig";
import AuthContext from "../contexts/AuthContext";
export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const { logout } = useContext(AuthContext);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
    } catch (err) {}
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg 
        md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400
        dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <nav
        id="logo-sidebar"
        className={`fixed shadow-lg top-0 left-0 z-40 w-60 h-screen transition-transform p-5 overflow-y-auto
      ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 bg-white`}
      >
        {sidebarOpen && isMobile && (
          <button
            onClick={closeSidebar}
            className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 rounded-lg
            bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
            aria-label="Close sidebar"
          >
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 1.41L10.59 0 6 4.59 1.41 0 0 1.41 4.59 6 0 10.59 1.41 12 6 7.41 10.59 12 12 10.59 7.41 6 12 1.41Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        )}
        <a href="/admin">
          <h1
            className="text-center text-4xl font-serif"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Nectar
          </h1>{" "}
        </a>

        <ul class="mt-6">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 bg-blue-50 text-sm flex items-center rounded px-4 py-3"
                : "text-black hover:text-blue-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-[18px] h-[18px] mr-4"
              viewBox="0 0 512 512"
            >
              <path d="M197.332 170.668h-160C16.746 170.668 0 153.922 0 133.332v-96C0 16.746 16.746 0 37.332 0h160c20.59 0 37.336 16.746 37.336 37.332v96c0 20.59-16.746 37.336-37.336 37.336zM37.332 32A5.336 5.336 0 0 0 32 37.332v96a5.337 5.337 0 0 0 5.332 5.336h160a5.338 5.338 0 0 0 5.336-5.336v-96A5.337 5.337 0 0 0 197.332 32zm160 480h-160C16.746 512 0 495.254 0 474.668v-224c0-20.59 16.746-37.336 37.332-37.336h160c20.59 0 37.336 16.746 37.336 37.336v224c0 20.586-16.746 37.332-37.336 37.332zm-160-266.668A5.337 5.337 0 0 0 32 250.668v224A5.336 5.336 0 0 0 37.332 480h160a5.337 5.337 0 0 0 5.336-5.332v-224a5.338 5.338 0 0 0-5.336-5.336zM474.668 512h-160c-20.59 0-37.336-16.746-37.336-37.332v-96c0-20.59 16.746-37.336 37.336-37.336h160c20.586 0 37.332 16.746 37.332 37.336v96C512 495.254 495.254 512 474.668 512zm-160-138.668a5.338 5.338 0 0 0-5.336 5.336v96a5.337 5.337 0 0 0 5.336 5.332h160a5.336 5.336 0 0 0 5.332-5.332v-96a5.337 5.337 0 0 0-5.332-5.336zm160-74.664h-160c-20.59 0-37.336-16.746-37.336-37.336v-224C277.332 16.746 294.078 0 314.668 0h160C495.254 0 512 16.746 512 37.332v224c0 20.59-16.746 37.336-37.332 37.336zM314.668 32a5.337 5.337 0 0 0-5.336 5.332v224a5.338 5.338 0 0 0 5.336 5.336h160a5.337 5.337 0 0 0 5.332-5.336v-224A5.337 5.337 0 0 0 474.668 32z" />
            </svg>
            Dashboard
          </NavLink>
        </ul>

        <div class="mt-6">
          <h6 class="text-green-600 text-l font-bold px-4">Management</h6>

          <ul class="mt-3">
            <li>
              <NavLink
                to="/admin/category"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                    : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                }
              >
                <TbCategoryPlus />
                <span className="ml-4">Category</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/add-product"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                    : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                }
              >
                <CiShoppingCart />
                <span className="ml-4">Product</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/cadeau-product"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                    : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                }
              >
                <CiGift />
                <span className="ml-4">Cadeau</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/promotion"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                    : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                }
              >
                <PiSealPercentLight />

                <span className="ml-4">Promotion</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div class="mt-6">
          <h6 class="text-green-600 text-l font-bold px-4">Income</h6>
          <ul class="mt-3">
            <li>
              <NavLink
                to="/admin/order"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                    : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 511.877 511.877"
                >
                  <path
                    d="M442.706 340.677c-11-68.6-93.8-175.7-120.1-208.2 4.2-3.5 6.9-8.7 6.9-14.6 0-4.2-1.4-8-3.7-11.1 2.3-3.1 3.7-7 3.7-11.1 0-6.6-3.4-12.4-8.5-15.7 8.1-33.1 31.3-59.5 32.4-60.7.8-.9 1.3-1.9 1.6-3 .7-2.4.1-5.1-1.5-7.1-1-1.2-2.3-2.1-3.8-2.5-63.1-17.5-114.9 4.1-129.7 11.4-12.3-7.5-24.5-14-39.9-16.2-5-.7-10.1-1-15.7-1a7.719 7.719 0 0 0-6.9 11.2s.6 1.1 1 1.6c.3.3 26.7 31.7 35.2 66.2-5.1 3.4-8.5 9.2-8.5 15.7 0 4.2 1.4 8 3.7 11.1-2.3 3.1-3.7 7-3.7 11.1 0 5.1 2 9.7 5.3 13.1-25.1 31-110.2 140-121.3 209.8-1.2 5.8-17.4 86.9 23.1 135.8 19.4 23.5 48.5 35.4 86.4 35.4 1.5 0 2.9 0 4.4-.1h145.7c1.5 0 3 .1 4.4.1 37.9 0 66.9-11.9 86.4-35.4 40.4-48.9 24.3-130 23.1-135.8zm-239.2-219.5h-.1c-1.6-.3-2.7-1.7-2.7-3.3 0-1.9 1.5-3.4 3.4-3.4h106.6c1.9 0 3.4 1.5 3.4 3.4s-1.5 3.4-3.4 3.4h-106.7c-.2-.1-.3-.1-.5-.1zm-2.9-25.6c0-1.8 1.5-3.3 3.3-3.4h106.7c1.8 0 3.3 1.5 3.3 3.4s-1.5 3.4-3.4 3.4h-106.5c-1.9 0-3.4-1.5-3.4-3.4zm124.3-78.4c-1.1.7-2.2 1.4-3.2 2.1 0 0-.1.1-.2.1-2.3 1.5-4.5 2.9-6.8 4.3-9.5 5.8-19.2 9.3-29.5 10.9-11.2 1.7-22.9 1.1-33.9-1.5-4.8-1.2-9.4-2.8-14.2-5.1-.2-.1-.3-.2-.5-.2 17.1-6.9 49.6-16.2 88.3-10.6zm-106.8 17.9 1.3.8c9.7 6 18.7 9.9 28.2 12.2 12.9 3.1 26.7 3.7 39.8 1.8 12-1.8 23.1-5.8 34.1-12.2-6.2 11-12.3 24.4-15.9 39.1h-96.9c-5.7-23.4-18.7-45.4-28.1-59 13.7 2.5 24.8 9.4 37.5 17.3zm189.5 431.5c-17 20.6-43.5 30.6-78.5 29.7h-146.3c-35.1.8-61.5-9.1-78.5-29.7-36.3-43.7-20.1-122.1-19.9-122.9 0-.1.1-.3.1-.4 10.9-69.1 104.5-186 121.3-206.6h100.3c16.5 20.1 110.4 137.4 121.3 206.6 0 .1 0 .3.1.4.1.8 16.4 79-19.9 122.9zm-151.7-233.7c-46.1 0-83.6 37.5-83.6 83.6s37.5 83.6 83.6 83.6 83.6-37.5 83.6-83.6c.1-46.1-37.5-83.6-83.6-83.6zm0 151.7c-37.6 0-68.1-30.6-68.1-68.1s30.6-68.1 68.1-68.1 68.1 30.5 68.1 68.1-30.5 68.1-68.1 68.1zm28.1-53.6c0 11.6-9 21.2-20.3 22.1v4c0 4.3-3.5 7.8-7.8 7.8s-7.8-3.5-7.8-7.8v-3.9h-5.5c-4.3 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8h19.1a6.7 6.7 0 0 0 0-13.4h-11.7c-12.3 0-22.2-10-22.2-22.2 0-11.6 9-21.2 20.3-22.1v-4c0-4.3 3.5-7.8 7.8-7.8s7.8 3.5 7.8 7.8v3.9h5.5c4.3 0 7.8 3.5 7.8 7.8s-3.5 7.8-7.8 7.8h-19.1a6.7 6.7 0 0 0 0 13.4h11.7c12.2-.1 22.2 9.9 22.2 22.2z"
                    data-original="#000000"
                  />
                </svg>
                <span>Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                    : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
                    data-original="#000000"
                  />
                </svg>
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/messages"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                    : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                }
              >
                <LuMessagesSquare />
                <span className="ml-4">Messages</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div class="mt-6">
          <h6 class="text-green-600 text-l font-bold px-4">Actions</h6>
          <ul class="mt-3">
            {/* <NavLink to='/profile'> */}
            <li>
              <Link
                onClick={toggleProfile}
                className="text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3 transition-all"
              >
                <LuSettings2 className="w-[18px] h-[18px] mr-4" />

                <span>Settings</span>
              </Link>
            </li>

            {/* Additional Tabs */}
            {isProfileOpen && (
              <>
                <li className="ml-4">
                  <NavLink
                    to="/admin/profile"
                    className={({ isActive }) =>
                      isActive
                        ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                        : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                    }
                  >
                    <IoSettingsOutline className="w-[18px] h-[18px] mr-2" />

                    <span>Account Settings</span>
                  </NavLink>
                </li>
                <li className="ml-4">
                  <NavLink
                    to="/admin/settings"
                    className={({ isActive }) =>
                      isActive
                        ? "text-green-600 bg-green-50 text-sm flex items-center rounded px-4 py-3"
                        : "text-black hover:text-green-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3"
                    }
                  >
                    <MdOutlineDisplaySettings className="w-[18px] h-[18px] mr-2" />

                    <span>Pages Settings</span>
                  </NavLink>
                </li>
              </>
            )}
            {/* </NavLink> */}

            <li>
              <NavLink
                className="text-black hover:text-red-600 text-sm flex items-center hover:bg-green-50 rounded px-4 py-3 transition-all"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 6.35 6.35"
                >
                  <path
                    d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                    data-original="#000000"
                  />
                </svg>
                <span>Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
