import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, BarChart3, Zap, Shield, Sparkles, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";

import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 -z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gold-300 rounded-full animate-pulse" />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
          </motion.div>
          
          <motion.h1 
            className="mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gradient">
              Smart Feedback Collection
            </span>
            <br />
            <span className="text-gold-400">
              & AI Analysis
            </span>
          </motion.h1>
          
          <motion.p 
            className="mx-auto mb-6 sm:mb-8 max-w-2xl text-lg sm:text-xl text-muted-foreground px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Harness the power of AI to analyze sentiment and gain insights from your feedback.
            Make data-driven decisions with real-time insights.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/feedback" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto gold-gradient hover:scale-105 transition-transform">
                <MessageSquare className="h-5 w-5" />
                Submit Feedback
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-gold-400 text-gold-400 hover:bg-gold-400/10 hover:scale-105 transition-all">
                <BarChart3 className="h-5 w-5" />
                View Analytics
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <motion.h2 
          className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold text-gradient"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Powerful Features
        </motion.h2>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MessageSquare, title: "Easy Submission", desc: "Simple and intuitive feedback form for users to share their thoughts.", delay: 0.1 },
            { icon: Zap, title: "AI-Powered Analysis", desc: "Instant sentiment analysis using advanced AI models for accurate results.", delay: 0.2 },
            { icon: BarChart3, title: "Visual Analytics", desc: "Interactive charts and graphs to visualize sentiment trends over time.", delay: 0.3 },
            { icon: Shield, title: "Secure Storage", desc: "All feedback is securely stored with proper authentication and privacy controls.", delay: 0.4 }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-6 glass-effect hover:border-gold-400/40 transition-all duration-300 group">
                <motion.div 
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold-400/10 group-hover:bg-gold-400/20 transition-colors"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="h-6 w-6 text-gold-400" />
                </motion.div>
                <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gold-100">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {feature.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
        <motion.div 
          className="mx-auto max-w-3xl rounded-2xl gold-gradient p-6 sm:p-8 lg:p-12 text-black relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 300] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2 
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="mb-6 sm:mb-8 text-base sm:text-lg opacity-90 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Start collecting feedback and gain valuable insights today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/feedback">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto bg-black text-gold-400 hover:bg-gray-900 hover:scale-105 transition-all relative z-10">
                <Sparkles className="h-5 w-5" />
                Submit Your First Feedback
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;