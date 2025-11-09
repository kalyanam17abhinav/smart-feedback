import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, BarChart3 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Full Screen Content Box */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl h-full flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white shadow-lg border-[#98B6D9]">
          <motion.div
            className="text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="mb-6 sm:mb-8 text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[#05080E]">
                Smart Feedback Collection
              </span>
              <br />
              <span className="text-[#5577A9]">
                & Analysis
              </span>
            </motion.h1>
            
            <motion.p 
              className="mx-auto mb-8 sm:mb-12 max-w-2xl text-lg sm:text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Capture and understand what truly matters — turning every response into meaningful improvement.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/feedback" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto bg-[#2f4375] hover:bg-[#2f4375]/90 text-white hover:scale-105 transition-transform">
                  <MessageSquare className="h-5 w-5" />
                  Submit Feedback
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto hover:scale-105 transition-all">
                  <BarChart3 className="h-5 w-5" />
                  View Analytics
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
};

export default Home;