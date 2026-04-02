import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll } from 'framer-motion';
import { Bell, FileText, TrendingUp, AlertTriangle, Download, Users, Zap, Shield } from 'lucide-react';

const Features = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const features = [
    {
      icon: Bell,
      title: "Budget Alerts",
      description: "Smart notifications when you approach spending limits",
      color: "from-blue-500 to-cyan-500",
      animation: "pulse"
    },
    {
      icon: FileText,
      title: "Smart Invoicing",
      description: "Create and send professional invoices in seconds",
      color: "from-purple-500 to-pink-500",
      animation: "slide"
    },
    {
      icon: TrendingUp,
      title: "Growth Insights",
      description: "Real-time analytics to track your business growth",
      color: "from-green-500 to-emerald-500",
      animation: "chart"
    },
    {
      icon: AlertTriangle,
      title: "Expense Tracking",
      description: "Automatically categorize and track every expense",
      color: "from-orange-500 to-red-500",
      animation: "float"
    },
    {
      icon: Download,
      title: "Financial Reports",
      description: "Export detailed reports for tax and analysis",
      color: "from-indigo-500 to-purple-500",
      animation: "rotate"
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Keep all client information organized in one place",
      color: "from-pink-500 to-rose-500",
      animation: "bounce"
    }
  ];

  return (
    <section ref={containerRef} className="relative py-24 bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#ff006e] rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#ff4d94] rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-[#ff006e] to-[#ff4d94] bg-clip-text text-transparent">
              Scale Faster
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built for founders who want to spend less time on admin and more time on growth
          </p>
        </motion.div>

        {/* 3D Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index, scrollYProgress }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const animations = {
    pulse: {
      initial: { scale: 1 },
      animate: { scale: [1, 1.05, 1] },
      transition: { duration: 2, repeat: Infinity }
    },
    slide: {
      initial: { x: -20 },
      animate: { x: 0 },
      transition: { duration: 0.8, delay: 0.2 }
    },
    chart: {
      initial: { pathLength: 0 },
      animate: { pathLength: 1 },
      transition: { duration: 1.5, ease: "easeInOut" }
    },
    float: {
      initial: { y: 0 },
      animate: { y: [-10, 10, -10] },
      transition: { duration: 3, repeat: Infinity }
    },
    rotate: {
      initial: { rotate: 0 },
      animate: { rotate: 360 },
      transition: { duration: 20, repeat: Infinity, ease: "linear" }
    },
    bounce: {
      initial: { y: 0 },
      animate: { y: [0, -20, 0] },
      transition: { duration: 1, repeat: Infinity }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 20px 40px rgba(255, 0, 110, 0.3)",
        z: 10
      }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff006e] to-[#ff4d94] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      
      <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 h-full">
        {/* Animated Icon */}
        <motion.div
          {...animations[feature.animation]}
          className="mb-6"
        >
          <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
            <feature.icon className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
        <p className="text-gray-400 mb-6">{feature.description}</p>

        {/* Interactive Elements */}
        {feature.animation === 'pulse' && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-blue-400"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm">Active monitoring</span>
          </motion.div>
        )}

        {feature.animation === 'slide' && (
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">PDF ready</span>
          </motion.div>
        )}

        {feature.animation === 'chart' && (
          <div className="mt-4">
            <svg viewBox="0 0 100 40" className="w-full h-10">
              <motion.path
                d="M0,30 L20,25 L40,15 L60,20 L80,10 L100,15"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {feature.animation === 'float' && (
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-orange-400"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm">Auto-tracking</span>
          </motion.div>
        )}

        {feature.animation === 'rotate' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-2 text-indigo-400"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export ready</span>
          </motion.div>
        )}

        {feature.animation === 'bounce' && (
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-2 text-pink-400"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">Client portal</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Features;
