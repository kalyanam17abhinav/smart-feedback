import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { MessageSquare, BarChart3, History, User, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth');
  };

  return (
    <motion.nav 
      className="border-b border-[#98B6D9] bg-white/90 backdrop-blur-md shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold group">
            <span className="text-[#05080E] group-hover:scale-105 transition-transform">
              Smart Feedback
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/feedback">
              <Button variant="ghost" size="sm" className="gap-2 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden lg:block">Submit Feedback</span>
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 transition-colors">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden lg:block">Analytics</span>
              </Button>
            </Link>

            {user && user.role !== 'guest' && (
              <Link to="/history">
                <Button variant="ghost" size="sm" className="gap-2 transition-colors">
                  <History className="h-4 w-4" />
                  <span className="hidden lg:block">My Feedback</span>
                </Button>
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-2 transition-colors">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:block">Admin</span>
                </Button>
              </Link>
            )}

            {user ? (
              <Button variant="ghost" size="sm" className="gap-2 transition-colors" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:block">Logout</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2 transition-colors">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:block">Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 pb-4 border-t pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                <Link to="/feedback" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Submit Feedback
                  </Button>
                </Link>

                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Button>
                </Link>

                {user && user.role !== 'guest' && (
                  <Link to="/history" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <History className="h-4 w-4" />
                      My Feedback
                    </Button>
                  </Link>
                )}

                {user && user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}

                {user ? (
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};