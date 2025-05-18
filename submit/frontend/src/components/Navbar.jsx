import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../hooks/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHexagonNodes, faUser, faBars, faArrowLeft, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const Navbar = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    
    const isUniversal = location.pathname === '/universal';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const logout = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}auth/logout`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
            console.log("Logout request sent.");
        
          if (response.ok) {
            console.log("Logout successful.");
            setUser(null);
            navigate("/");
          } else {
            console.error("Failed to logout");
          }
        } catch (error) {
          console.error("An error occurred during logout:", error);
        }
    };

    return (
        <>
            <nav className="flex w-full z-30 items-center justify-between py-2 px-7 border-gray-600 border-b bg-opacity-50 backdrop-blur-sm md:sticky md:top-0 relative">

                <button 
                    className="md:hidden text-2xl"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <FontAwesomeIcon icon={isMobileMenuOpen ? faArrowLeft : faBars} />
                </button>

                <div className="flex-1 flex justify-start">
                    <Link to="/">
                        <FontAwesomeIcon 
                            icon={faHexagonNodes} 
                            className="hidden md:w-8 md:h-8 md:inline text-indigo-500 "
                        />
                    </Link>
                </div>

                <div className="hidden md:flex space-x-6 flex-1 justify-center font-light tracking-normal">
                    <Link to="/" className="hover:text-indigo-400 transition-colors duration-300">Home</Link>
                    <Link to="/universal" className="hover:text-indigo-400 transition-colors duration-300">Explore</Link>
                    <Link to="/about" className="hover:text-indigo-400 transition-colors duration-300">About</Link>
                </div>

                <div className="hidden md:flex items-center flex-1 justify-end">
                    {!user && (
                        <a href={`${BACKEND_URL}auth/google`}>
                            <button className="border-solid rounded-md px-4 py-2 mr-2 bg-indigo-500 hover:bg-indigo-600 focus:ring-2 focus:outline-none focus:ring-indigo-300 text-white">
                                Log-In
                            </button>
                        </a>
                    )}
                    
                    {user && (
                        <Popover className="relative">
                            <PopoverButton className="border-solid rounded-full mr-4 bg-gray-700 p-0 h-9 w-9 flex items-center justify-center">
                                <img src={user.imageURL} alt="User Avatar" className="h-full w-full object-cover rounded-full border-gray-400 border-[1.6px]" />
                            </PopoverButton>
                        
                            <PopoverPanel
                                transition
                                className="absolute right-0 mt-3 w-48 bg-gray-900 border rounded-lg shadow-lg ring-1 ring-gray-900/5 transition duration-200 ease-out">
                                <ul className="list-none p-2 text-white">
                                    <li className="p-3 flex items-center gap-2 hover:bg-gray-700 cursor-pointer rounded-md"
                                        onClick={() => { navigate('/profile') }}>
                                        <FontAwesomeIcon icon={faUser} />
                                        Profile
                                    </li>
                                    <li className="p-3 flex items-center gap-2 hover:bg-gray-700 cursor-pointer rounded-md text-red-500 font-semibold"
                                        onClick={logout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                        Logout
                                    </li>
                                </ul>
                            </PopoverPanel>
                        </Popover>
                    )}
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={closeMobileMenu}>
                    <div className="fixed left-0 top-0 h-full w-64 bg-black shadow-lg z-50 p-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={closeMobileMenu}
                            className="top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 ml-48"/>
                        </button>
                        <div className="flex flex-col mt-6 h-[90%]">
                            <div className="flex flex-col space-y-4 flex-grow">
                                <Link to="/" className="p-2 hover:bg-gray-100 rounded hover:text-gray-700 transition-all duration-300" onClick={closeMobileMenu}>Home</Link>
                                <Link to="/universal" className="p-2 hover:bg-gray-100 rounded hover:text-gray-700 transition-all duration-300" onClick={closeMobileMenu}>Explore</Link>
                                <Link to="/about" className="p-2 hover:bg-gray-100 rounded hover:text-gray-700 transition-all duration-300" onClick={closeMobileMenu}>About</Link>
                            </div>

                            <div className="border-t pt-4">
                                {!user ? (
                                    <a href={`${BACKEND_URL}auth/google`}>
                                        <button className="w-full border-solid rounded-md px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white" onClick={ closeMobileMenu }>
                                            Log-In
                                        </button>
                                    </a>
                                ) : (
                                    <div>
                                        <button className="w-full border border-gray-500 rounded-md px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center justify-center shadow-md" 
                                            onClick={() => {
                                                closeMobileMenu();
                                                navigate('/profile');
                                            }}>
                                            <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-800" />
                                            Profile
                                        </button>

                                        <button className="w-full border border-gray-500 rounded-md px-4 py-2 bg-gray-200 hover:bg-gray-300 text-red-600 flex items-center justify-center shadow-md mt-2" 
                                            onClick={() => {
                                                closeMobileMenu();
                                                logout();
                                            }}>
                                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-red-600"/>
                                            Logout
                                        </button>
                                    </div>
                                )}
                                {!isUniversal &&
                                    <button className="w-full border-solid rounded-md px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white mt-2" 
                                        onClick= {()=>{
                                            closeMobileMenu();
                                            navigate('/universal')
                                        }}>
                                        Explore
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
