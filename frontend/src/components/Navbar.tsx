import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { MessageSquare, BarChart3, History, LogOut, User, Menu, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    }
  };

  return (
    <motion.nav 
      className="border-b border-gold-400/20 bg-card/80 backdrop-blur-md shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold group">
            <span className="text-gradient group-hover:scale-105 transition-transform">
              Smart Feedback
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/feedback">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-gold-400/10 hover:text-gold-400 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden lg:block">Submit Feedback</span>
              </Button>
            </Link>

            {user && (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-gold-400/10 hover:text-gold-400 transition-colors">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden lg:block">Analytics</span>
                  </Button>
                </Link>

                <Link to="/history">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-gold-400/10 hover:text-gold-400 transition-colors">
                    <History className="h-4 w-4" />
                    <span className="hidden lg:block">My Feedback</span>
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-gold-400/10 hover:text-gold-400 transition-colors">
                      <User className="h-4 w-4" />
                      <span className="hidden lg:block">Admin</span>
                    </Button>
                  </Link>
                )}

                <Button variant="ghost" size="sm" className="gap-2 hover:bg-red-500/10 hover:text-red-400 transition-colors" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:block">Logout</span>
                </Button>
              </>
            )}

            {!user && (
              <Link to="/auth">
                <Button size="sm" className="gap-2 gold-gradient hover:scale-105 transition-transform">
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
            className="md:hidden text-gold-400 hover:bg-gold-400/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 pb-4 border-t border-gold-400/20 pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                <Link to="/feedback" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-gold-400/10 hover:text-gold-400">
                    <MessageSquare className="h-4 w-4" />
                    Submit Feedback
                  </Button>
                </Link>

                {user && (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-gold-400/10 hover:text-gold-400">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </Button>
                    </Link>

                    <Link to="/history" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-gold-400/10 hover:text-gold-400">
                        <History className="h-4 w-4" />
                        My Feedback
                      </Button>
                    </Link>

                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-gold-400/10 hover:text-gold-400">
                          <User className="h-4 w-4" />
                          Admin
                        </Button>
                      </Link>
                    )}

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-2 hover:bg-red-500/10 hover:text-red-400" 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}

                {!user && (
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-start gap-2 gold-gradient">
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