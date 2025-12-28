// HPI 1.5-V
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { 
  GraduationCap, 
  Lock, 
  User, 
  ShieldCheck, 
  Database, 
  Search, 
  Zap, 
  Activity, 
  Server, 
  Code, 
  Cpu,
  ChevronRight
} from 'lucide-react';

// --- Utility Components for Motion & Layout ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ParallaxImage = ({ src, alt, id, className }: { src: string, alt: string, id: string, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
        <Image
          src={`${src}?id=${id}`}
          alt={alt}
          width={1200}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

const GlowingGrid = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#64FFDA10_1px,transparent_1px),linear-gradient(to_bottom,#64FFDA10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
  </div>
);

// --- Main Component ---

export default function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Canonical Data Source: Login Logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('username', username);
      navigate('/dashboard');
    } else if (username === 'viewer' && password === 'viewer123') {
      localStorage.setItem('userRole', 'viewer');
      localStorage.setItem('username', username);
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try admin/admin123 or viewer/viewer123');
    }
  };

  // Canonical Data Source: Background Animation Data
  const dataStream = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    value: Math.floor(Math.random() * 1000).toString(16).toUpperCase(),
    delay: Math.random() * 5,
    x: Math.random() * 100,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-electric-teal selection:text-background overflow-x-clip">
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-electric-teal origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation (Visual Only) */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-[120rem] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-electric-teal rounded-sm animate-pulse" />
            <span className="font-heading font-bold text-xl tracking-tighter">NEXUS<span className="text-electric-teal">.EDU</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-foreground/60">
            <span className="hover:text-electric-teal cursor-pointer transition-colors">System Status</span>
            <span className="hover:text-electric-teal cursor-pointer transition-colors">Documentation</span>
            <span className="px-3 py-1 border border-electric-teal/30 rounded text-electric-teal text-xs">V 2.0.4</span>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <GlowingGrid />
        
        {/* Floating Data Stream Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          {dataStream.map((item) => (
            <motion.div
              key={item.id}
              className="absolute text-xs text-electric-teal font-mono"
              style={{ left: `${item.x}%` }}
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ y: '-10vh', opacity: [0, 1, 0] }}
              transition={{
                duration: 10 + Math.random() * 10,
                delay: item.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              0x{item.value}
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-[120rem] mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-8">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-teal/10 border border-electric-teal/20 text-electric-teal text-xs mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-teal"></span>
                </span>
                SYSTEM OPERATIONAL
              </div>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-heading font-bold leading-[0.9] tracking-tighter">
                STUDENT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-teal to-white">INTELLIGENCE</span> <br />
                GRID
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-foreground/60 max-w-2xl leading-relaxed border-l-2 border-electric-teal/30 pl-6">
                A futuristic command center for academic data management. 
                Experience real-time record processing, role-based security protocols, 
                and instant analytics in a unified interface.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3 px-6 py-4 bg-deep-space-blue/50 border border-white/10 rounded-lg backdrop-blur-sm">
                  <ShieldCheck className="w-5 h-5 text-electric-teal" />
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/40 uppercase tracking-wider">Security</span>
                    <span className="font-bold">Role-Based Access</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-deep-space-blue/50 border border-white/10 rounded-lg backdrop-blur-sm">
                  <Zap className="w-5 h-5 text-electric-teal" />
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/40 uppercase tracking-wider">Performance</span>
                    <span className="font-bold">Real-Time Sync</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Login Terminal */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Decorative elements behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-electric-teal to-purple-600 rounded-xl blur opacity-20 animate-pulse" />
              
              <Card className="relative bg-[#0A0F14] border border-electric-teal/20 p-8 md:p-10 shadow-2xl overflow-hidden">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-10" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-white">ACCESS PORTAL</h2>
                      <p className="text-xs text-electric-teal font-mono mt-1">SECURE CONNECTION ESTABLISHED</p>
                    </div>
                    <Lock className="w-6 h-6 text-electric-teal" />
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-xs uppercase tracking-widest text-foreground/50">Identity</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-electric-teal transition-colors" />
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-foreground focus:border-electric-teal focus:ring-electric-teal/20 h-12 transition-all"
                          placeholder="ENTER USERNAME"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs uppercase tracking-widest text-foreground/50">Passcode</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-electric-teal transition-colors" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-foreground focus:border-electric-teal focus:ring-electric-teal/20 h-12 transition-all"
                          placeholder="ENTER PASSWORD"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-destructive/10 border-l-2 border-destructive p-3"
                      >
                        <p className="text-xs text-destructive font-mono">{error}</p>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-electric-teal text-black hover:bg-electric-teal/90 h-12 font-bold tracking-wide text-sm uppercase relative overflow-hidden group"
                    >
                      <span className="relative z-10">Initialize Session</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>

                    <div className="pt-6 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-foreground/40">
                        <div className="p-2 bg-white/5 rounded border border-white/5">
                          <span className="block text-electric-teal mb-1">ADMIN NODE</span>
                          admin / admin123
                        </div>
                        <div className="p-2 bg-white/5 rounded border border-white/5">
                          <span className="block text-secondary mb-1">VIEWER NODE</span>
                          viewer / viewer123
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TICKER TAPE */}
      <div className="w-full bg-electric-teal text-black py-3 overflow-hidden border-y border-black/10">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-8 font-mono text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4" /> SYSTEM STATUS: OPTIMAL // DATABASE: CONNECTED // LATENCY: 12ms // ENCRYPTION: AES-256 //
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES GRID SECTION */}
      <section className="py-32 relative">
        <div className="w-full max-w-[120rem] mx-auto px-6">
          <div className="mb-20">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">CORE PROTOCOLS</h2>
              <div className="h-1 w-20 bg-electric-teal" />
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Persistent Storage",
                desc: "Client-side local storage implementation ensures data integrity across sessions without server dependency.",
                tech: "LocalStorage API"
              },
              {
                icon: ShieldCheck,
                title: "Role-Based Access",
                desc: "Granular permission systems separating administrative CRUD operations from read-only viewer access.",
                tech: "Auth Logic"
              },
              {
                icon: Search,
                title: "Live Query Engine",
                desc: "Real-time filtering and search capabilities with instant DOM updates and zero latency.",
                tech: "Reactive State"
              },
              {
                icon: Code,
                title: "Type Safety",
                desc: "Built on a strict TypeScript foundation ensuring runtime stability and developer confidence.",
                tech: "TypeScript"
              },
              {
                icon: Server,
                title: "CRUD Operations",
                desc: "Full lifecycle management for student records: Create, Read, Update, and Delete with validation.",
                tech: "State Management"
              },
              {
                icon: Cpu,
                title: "Input Validation",
                desc: "Rigorous regex-based validation preventing malformed data entry at the source.",
                tech: "Regex Patterns"
              }
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group relative h-full bg-deep-space-blue/30 border border-white/10 p-8 hover:border-electric-teal/50 transition-colors duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <feature.icon className="w-24 h-24 text-electric-teal" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-electric-teal/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-electric-teal group-hover:text-black transition-colors duration-300">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                    <p className="text-foreground/60 text-sm leading-relaxed mb-6">{feature.desc}</p>
                    <div className="inline-block px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-electric-teal border border-electric-teal/20">
                      {feature.tech}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* IMMERSIVE PARALLAX SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden my-20">
        <div className="absolute inset-0 z-0">
          <ParallaxImage 
            src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png"
            id="parallax-bg-1"
            alt="Abstract digital network visualization"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 w-full max-w-[100rem] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <FadeIn>
              <h2 className="text-5xl md:text-7xl font-heading font-bold text-white">
                DATA <br />
                <span className="text-electric-teal">VISUALIZED</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-white/80 max-w-md">
                Transform raw student metrics into actionable insights. 
                The dashboard provides a unified view of attendance, grades, and performance trends.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <Button 
                onClick={() => document.getElementById('username')?.focus()}
                className="bg-transparent border border-electric-teal text-electric-teal hover:bg-electric-teal hover:text-black transition-all h-14 px-8 text-lg"
              >
                INITIATE DEMO
              </Button>
            </FadeIn>
          </div>

          {/* Floating Stats Cards */}
          <div className="relative h-[400px] hidden md:block">
            <motion.div 
              className="absolute top-0 right-0 w-64 bg-[#0A0F14] border border-electric-teal/30 p-6 shadow-2xl z-20"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-foreground/50">TOTAL RECORDS</span>
                <Database className="w-4 h-4 text-electric-teal" />
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-2">2,845</div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-electric-teal" />
              </div>
            </motion.div>

            <motion.div 
              className="absolute bottom-10 left-10 w-64 bg-[#0A0F14] border border-secondary/30 p-6 shadow-2xl z-10"
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-foreground/50">SYSTEM LOAD</span>
                <Activity className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-4xl font-mono font-bold text-white mb-2">98.4%</div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-secondary" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE DIAGRAM SECTION */}
      <section className="py-32 bg-deep-space-blue/20 border-y border-white/5">
        <div className="w-full max-w-[120rem] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-square max-w-xl mx-auto">
                {/* Abstract representation of architecture */}
                <div className="absolute inset-0 border border-electric-teal/20 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 border border-dashed border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-electric-teal/10 rounded-full blur-xl animate-pulse" />
                </div>
                
                {/* Nodes */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#0A0F14] border border-electric-teal flex items-center justify-center rounded-xl z-10"
                  whileHover={{ scale: 1.1 }}
                >
                  <Database className="w-8 h-8 text-electric-teal" />
                </motion.div>
                
                {[0, 90, 180, 270].map((deg, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#0A0F14] border border-white/20 flex items-center justify-center rounded-lg"
                    style={{ 
                      marginLeft: '-2rem', 
                      marginTop: '-2rem',
                      transform: `rotate(${deg}deg) translateY(-160px) rotate(-${deg}deg)` 
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <div className="w-2 h-2 bg-white/50 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <FadeIn>
                <h2 className="text-4xl font-heading font-bold">MODULAR ARCHITECTURE</h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-lg text-foreground/60 leading-relaxed">
                  Built on a component-driven framework, the system ensures scalability and maintainability. 
                  Every interface element is an independent module, communicating through a centralized state manager.
                </p>
              </FadeIn>
              
              <div className="space-y-6">
                {[
                  { title: "Component Library", desc: "Shadcn/UI based atomic design system" },
                  { title: "State Management", desc: "React Hooks & Context API for global data flow" },
                  { title: "Animation Engine", desc: "Framer Motion for hardware-accelerated transitions" }
                ].map((item, i) => (
                  <FadeIn key={i} delay={0.2 + (i * 0.1)}>
                    <div className="flex gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full border border-electric-teal/50 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-electric-teal rounded-full" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{item.title}</h4>
                        <p className="text-sm text-foreground/50">{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-electric-teal/5" />
        <div className="w-full max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-heading font-bold mb-8">READY TO DEPLOY?</h2>
            <p className="text-xl text-foreground/60 mb-12 max-w-2xl mx-auto">
              Access the complete student record management system. 
              Secure, fast, and built for the future of education.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => document.getElementById('username')?.focus()}
                className="h-16 px-10 bg-electric-teal text-black hover:bg-white hover:scale-105 transition-all text-lg font-bold uppercase tracking-wider w-full sm:w-auto"
              >
                Access Terminal
              </Button>
              <Button 
                variant="outline"
                className="h-16 px-10 border-white/20 hover:bg-white/5 text-lg font-bold uppercase tracking-wider w-full sm:w-auto"
              >
                View Documentation
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#05080a] py-12">
        <div className="w-full max-w-[120rem] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-electric-teal rounded-sm" />
            <span className="font-heading font-bold tracking-tighter text-foreground/80">NEXUS.EDU</span>
          </div>
          <div className="text-xs font-mono text-foreground/40">
            © 2024 SYSTEM CORE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 text-xs font-mono text-foreground/40">
            <span className="hover:text-electric-teal cursor-pointer transition-colors">PRIVACY_PROTOCOL</span>
            <span className="hover:text-electric-teal cursor-pointer transition-colors">TERMS_OF_SERVICE</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}