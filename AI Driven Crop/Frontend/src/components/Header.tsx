import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { Menu, X, Leaf, User } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: "landing", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "detect", label: "Detect Disease" },
    { id: "weather", label: "Weather" },
    { id: "mandi", label: "Market Prices" },
    { id: "how-it-works", label: "How It Works" },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setOpen(false); // ✅ close dropdown when navigating
  };

  // Fetch current user when page changes
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    apiClient
      .get("/auth/me")
      .then((res) => setUser(res.data.user || res.data))
      .catch(() => setUser(null));
  }, [currentPage]);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    setOpen(false);
    onNavigate("dashboard"); // ✅ go to guest dashboard instead of login
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigation("landing")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="size-6 text-white" />
            </div>
            <span className="text-green-900">AgriCare AI</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`relative py-2 transition-colors hover:text-green-600 ${
                  currentPage === item.id ? "text-green-600 font-semibold" : "text-gray-700"
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* User Menu (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  aria-label="Toggle user menu"
                  className="flex items-center gap-2 px-3 py-2 bg-white text-green-700 rounded-full shadow hover:bg-gray-100 transition"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=10b981&color=fff&size=32`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{user.name.trim()}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-2 text-xs text-gray-500">
                      Signed in as<br />
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="border-t border-gray-200" />
                    <button
                      onClick={() => handleNavigation("dashboard")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("login")}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="size-6 text-gray-700" />
            ) : (
              <Menu className="size-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? "bg-green-50 text-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation("dashboard")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="size-5" />
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <User className="size-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation("login")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="size-5" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}