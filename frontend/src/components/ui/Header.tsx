import { useState } from "react";
import { Link } from "react-router-dom";
// import logo from "../../assets/logo.png";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  // { name: "Blog", href: "/blog" },
  { name: "Pricing", href: "/pricing" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <Link
                className="block items-center gap-2 text-3xl text-primary font-700"
                to="/"
              >
                {/* <img className="mx-auto h-40 w-auto" src={logo} alt="Analytix"/> */}
                <span className="font-bold">d8a</span>
              </Link>
            </div>

            <div className="md:flex md:items-center md:gap-12">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        className="text-gray-500 transition hover:text-gray-500/75"
                        to={item.href}
                      >
                        {" "}
                        {item.name}{" "}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                <div className="sm:flex sm:gap-4">
                  <Link
                    className="rounded-full hover:cursor-pointer bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                    to="/login"
                  >
                    Login
                  </Link>

                  <div className="hidden sm:flex">
                    <Link
                      className="rounded-full hover:cursor-pointer bg-gray-100 px-5 py-2.5 text-sm font-medium text-primary"
                      to="/register"
                    >
                      Register
                    </Link>
                  </div>
                </div>

                <div className="block md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                    aria-controls="mobile-menu"
                    aria-expanded={isMenuOpen}
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden">
            <nav
              aria-label="Mobile"
              className="px-4 pt-2 pb-4 space-y-1 sm:px-6"
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="w-full justify-center flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full justify-center flex items-center rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-primary"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
