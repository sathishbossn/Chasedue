import React from 'react';
import { motion } from 'framer-motion';
import { APP_NAME } from '../src/constants/BrandConfig';
import { ArrowRight, TrendingUp, FileText, Bell } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff006e] rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff4d94] rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Side - Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-[#ff006e]/10 border border-[#ff006e]/30 rounded-full"
              >
                <Bell className="w-4 h-4 mr-2 text-[#ff006e]" />
                <span className="text-sm text-[#ff006e] font-medium">Trusted by 10,000+ founders</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Stop Playing{' '}
                <span className="bg-gradient-to-r from-[#ff006e] to-[#ff4d94] bg-clip-text text-transparent">
                  Accountant
                </span>
                <br />
                Start being a Founder
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-400 max-w-lg"
              >
                {APP_NAME} automates your financial admin so you can focus on what matters: building your empire. Track expenses, send invoices, and get insights in seconds, not hours.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#ff006e] text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#ff006e]/90 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-8 text-gray-400"
            >
              <div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm">Founders</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$2.5M</div>
                <div className="text-sm">Processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Floating Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard Window */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-[#1a1a1a] rounded-2xl p-6 shadow-2xl border border-gray-800"
            >
              {/* Window Controls */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>

              {/* Dashboard Content */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{APP_NAME} Dashboard</h3>
                  <div className="text-xs text-gray-400">Live</div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>Revenue</span>
                    </div>
                    <div className="text-xl font-bold">$24,500</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>Invoices</span>
                    </div>
                    <div className="text-xl font-bold">12</div>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-2">Monthly Growth</div>
                  <div className="flex items-end gap-1 h-16">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="flex-1 bg-gradient-to-t from-[#ff006e] to-[#ff4d94] rounded-t"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Growth Insight Card */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl border border-gray-200"
            >
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Growth Insight</span>
              </div>
              <div className="text-sm text-gray-600">Revenue up 32% this month</div>
              <div className="text-lg font-bold text-gray-900">+ $8,200</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
