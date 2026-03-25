import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BarChart3, Lightbulb, ShieldCheck, Target, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const Home = () => {
  return (
    <div className="space-y-32 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-5xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-widest"
        >
          <ShieldCheck size={18} />
          Empowering Rural Educators
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-6xl md:text-8xl font-bold tracking-tight text-primary leading-[1.1]"
        >
          Real-Time Student <br />
          <span className="italic text-text/80">Intelligence System</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-2xl text-text/50 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Turning Student Data into Actionable Insights. 
          A platform designed for young fellows to track performance, 
          identify at-risk students, and make better teaching decisions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/entry"
            className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-[24px] font-bold text-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-105"
          >
            Get Started
            <ArrowRight size={24} />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-12 py-6 bg-white text-primary border-2 border-primary/10 rounded-[24px] font-bold text-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-3 hover:scale-105"
          >
            View Dashboard
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-10">
        {[
          {
            title: "Advanced Data Entry",
            description: "Detailed forms for student details, parent info, and subject-wise marks. Designed for ease of use.",
            icon: BookOpen,
            color: "bg-primary/10 text-primary"
          },
          {
            title: "Real-Time Dashboard",
            description: "Instant visualization of class performance, attendance trends, and at-risk student alerts.",
            icon: BarChart3,
            color: "bg-secondary/10 text-secondary"
          },
          {
            title: "Actionable Insights",
            description: "AI-driven recommendations to help you focus on weak subjects and support struggling students.",
            icon: Lightbulb,
            color: "bg-accent/10 text-accent"
          }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            className="p-10 bg-white rounded-[48px] border border-primary/5 shadow-sm hover:shadow-xl transition-all space-y-6 group"
          >
            <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform", feature.color)}>
              <feature.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-text">{feature.title}</h3>
            <p className="text-text/50 leading-relaxed text-lg font-medium">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Problem/Solution Section */}
      <section className="bg-primary rounded-[60px] p-16 md:p-24 text-white overflow-hidden relative">
        <div className="relative z-10 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl font-bold leading-[1.1]">The Problem We Solve</h2>
            <p className="text-white/70 text-xl leading-relaxed font-medium">
              In rural schools, student data is often scattered across paper registers. 
              Fellows lack the tools to see trends in real-time, making it hard to support students who are falling behind.
            </p>
            <div className="space-y-6">
              {[
                "Eliminate manual data aggregation errors.",
                "Identify at-risk students within seconds.",
                "Focus on teaching, not paperwork."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1.5 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                  <p className="text-white/90 text-lg font-bold">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="aspect-square bg-white/5 rounded-full flex items-center justify-center p-12">
              <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center p-12">
                <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center">
                  <GraduationCap size={160} className="text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
