import React, { useState, useEffect } from "react";
import {ChevronLeft, ChevronRight, Mail, Phone, ExternalLink, MapPin} from "lucide-react";

// Carousel images (in public//)
const carouselItems = [
  {
    title: "Excellence in Education",
    description: "VIT-AP University delivers world-class academics, global exposure, and a vibrant campus life.",
    image: "/VIT1.jpeg",
    buttonText: "Visit Official Site",
    buttonAction: () => window.open("https://vitap.ac.in", "_blank"),
  },
  {
    title: "Global Partnerships",
    description: "Learn through international collaborations with top universities worldwide.",
    image: "/VIT2.JPG",
    buttonText: "Login",
    buttonAction: () => window.location.href = "/auth",
  },
  {
    title: "Industry-Ready Placements",
    description: "Outstanding placement rates and top recruiters ensure your bright future.",
    image: "/VIT3.JPG",
    buttonText: "Sign Up",
    buttonAction: () => window.location.href = "/auth",
  },
];

// Stats
const stats = [
  {
    value: "8,500+",
    label: "Students",
    gradient: "from-blue-500 via-blue-400 to-blue-700",
  },
  {
    value: "92%",
    label: "Placement Rate",
    gradient: "from-orange-400 via-orange-500 to-orange-700",
  },
  {
    value: "120+",
    label: "International Partners",
    gradient: "from-green-400 via-blue-400 to-blue-700",
  },
  {
    value: "250+",
    label: "Industry Collaborations",
    gradient: "from-purple-500 via-blue-500 to-blue-700",
  },
];

const placementStats = [
  { label: "Placement Rate", value: "92%", color: "bg-green-500" },
  { label: "Highest Package", value: "₹45 LPA", color: "bg-blue-500" },
  { label: "Average Package", value: "₹9.2 LPA", color: "bg-orange-500" },
  { label: "Companies Visited", value: "350+", color: "bg-purple-500" },
];

const lineGraphPoints = [
  { year: 2021, value: 70 },
  { year: 2022, value: 80 },
  { year: 2023, value: 88 },
  { year: 2024, value: 92 },
];

// Clearbit logo data for marquee
const recruiterLogos = [
  { alt: "Microsoft", domain: "microsoft.com" },
  { alt: "Google", domain: "google.com" },
  { alt: "Apple", domain: "apple.com" },
  { alt: "Amazon", domain: "amazon.com" },
  { alt: "Meta", domain: "meta.com" },
  { alt: "TCS", domain: "tcs.com" },
  { alt: "Infosys", domain: "infosys.com" },
  { alt: "Wipro", domain: "wipro.com" },
  { alt: "IBM", domain: "ibm.com" },
  { alt: "Accenture", domain: "accenture.com" },
  { alt: "Cognizant", domain: "cognizant.com" },
  { alt: "Capgemini", domain: "capgemini.com" },
  { alt: "Deloitte", domain: "deloitte.com" },
  { alt: "KPMG", domain: "kpmg.com" },
  { alt: "EY", domain: "ey.com" },
  { alt: "PwC", domain: "pwc.com" },
  { alt: "Adobe", domain: "adobe.com" },
  { alt: "Intel", domain: "intel.com" },
  { alt: "Cisco", domain: "cisco.com" },
  { alt: "Oracle", domain: "oracle.com" },
  { alt: "SAP", domain: "sap.com" },
  { alt: "Salesforce", domain: "salesforce.com" },
  { alt: "LinkedIn", domain: "linkedin.com" },
  { alt: "Netflix", domain: "netflix.com" },
  { alt: "Uber", domain: "uber.com" },
  { alt: "PayPal", domain: "paypal.com" },
  { alt: "Dell", domain: "dell.com" },
  { alt: "HP", domain: "hp.com" },
];
const repeatedLogos = [...recruiterLogos, ...recruiterLogos, ...recruiterLogos, ...recruiterLogos];

function RecruiterMarquee() {
  return (
      <div
          style={{
            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            background: "#121212",
            padding: "40px 0",
            overflow: "hidden",
            boxShadow: "0 4px 24px 0 #0003",
            zIndex: 1,
          }}
      >
        <style>
          {`
          @keyframes logoScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .logo-track {
            display: flex;
            width: calc(180px * ${repeatedLogos.length});
            animation: logoScroll 60s linear infinite;
            align-items: center;
          }
          .logo-item {
            flex: 0 0 auto;
            width: 180px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 24px;
          }
          .logo-item img {
            max-height: 80px;
            max-width: 160px;
            object-fit: contain;
            background: none;
            transition: transform 0.3s;
          }
          .logo-item img:hover {
            transform: scale(1.12);
          }
          @media (max-width: 900px) {
            .logo-item { width: 120px; }
            .logo-track { width: calc(120px * ${repeatedLogos.length}); }
            .logo-item img { max-height: 48px; max-width: 90px; }
          }
          @media (max-width: 600px) {
            .logo-item { width: 90px; padding: 0 8px; }
            .logo-track { width: calc(90px * ${repeatedLogos.length}); }
            .logo-item img { max-height: 36px; max-width: 60px; }
          }
        `}
        </style>
        <div className="logo-track">
          {repeatedLogos.map((logo, i) => (
              <div className="logo-item" key={`${logo.domain}-${i}`}>
                <img
                    src={`https://logo.clearbit.com/${logo.domain}`}
                    alt={logo.alt}
                    loading="lazy"
                    onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
          ))}
        </div>
      </div>
  );
}

function CampusCard({ title, description, image }) {
  return (
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition group cursor-pointer">
        <div
            style={{
              width: "100%",
              aspectRatio: "16/9",
              position: "relative",
              background: "#111"
            }}
        >
          <img
              src={image}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              className="group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-400 transition">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{description}</p>
        </div>
      </div>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 font-sans">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900/80 sticky top-0 z-50 border-b border-gray-700/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-4xl font-bold text-orange-500">V-Connect</span>
            </div>
            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-md font-semibold transition" onClick={() => window.open("https://vitap.ac.in", "_blank")}>
                Visit Official Site
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-2 rounded-md font-semibold transition" onClick={() => window.location.href = "/auth"}>
                Login
              </button>
              <button className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900 text-orange-400 px-5 py-2 rounded-md font-semibold border border-orange-400 transition" onClick={() => window.location.href = "/auth"}>
                Sign Up
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Carousel */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          {carouselItems.map((item, index) => (
              <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <div
                    style={{
                      width: "100%",
                      height: "100%",
                      aspectRatio: "16/9",
                      position: "relative",
                      background: "#111"
                    }}
                >
                  <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 w-full">
                    <div className="max-w-xl">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">{item.title}</h1>
                      <p className="text-lg text-gray-200 mb-6">{item.description}</p>
                      <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-md font-medium transition shadow-lg" onClick={item.buttonAction}>
                        {item.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          ))}
          {/* Carousel Controls */}
          <button onClick={() => setCurrentSlide(currentSlide === 0 ? carouselItems.length - 1 : currentSlide - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => setCurrentSlide((currentSlide + 1) % carouselItems.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition">
            <ChevronRight size={24} />
          </button>
          {/* Indicators */}
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
            {carouselItems.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition ${index === currentSlide ? "bg-orange-500" : "bg-white/50"}`}
                ></button>
            ))}
          </div>
        </div>

        {/* Animated Stats Section */}
        <section className="py-16 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
                <div key={i} className={`rounded-xl p-8 flex flex-col items-center shadow-lg bg-gradient-to-br ${stat.gradient} relative overflow-hidden`}>
                  <div className="mb-4">
                    <div className="w-20 h-20 rounded-full bg-black/20 flex items-center justify-center text-3xl font-bold text-white shadow-inner animate-pulse">{stat.value}</div>
                  </div>
                  <div className="text-lg font-semibold text-white">{stat.label}</div>
                </div>
            ))}
          </div>
        </section>

        {/* Placement Recruiter Marquee - full width */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Top Recruiters</h2>

        <RecruiterMarquee />

        {/* Animated Line Graph Before Campus Life */}
        <section className="py-12 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Placement Growth Over Years</h2>
            <div className="w-full h-56 flex items-end">
              <svg viewBox="0 0 400 180" className="w-full h-full">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#f59e42" />
                  </linearGradient>
                </defs>
                <polyline
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="5"
                    points="0,150 100,120 200,80 300,40 400,15"
                    className="animate-drawline"
                />
                {lineGraphPoints.map((pt, idx) => (
                    <circle key={idx} cx={idx * 100} cy={150 - pt.value} r="7" fill="#f59e42" className="animate-pop" />
                ))}
                {lineGraphPoints.map((pt, idx) => (
                    <text key={idx} x={idx * 100} y={170} fill="#fff" fontSize="16" textAnchor="middle">{pt.year}</text>
                ))}
              </svg>
            </div>
          </div>
        </section>

        {/* Placement Highlights */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-orange-500">Placement</span> Highlights
              </h2>
              <p className="text-gray-300 mb-8">
                VIT-AP University has a robust placement cell, ensuring students are industry-ready. Our strong corporate connections have resulted in excellent placement records year after year.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {placementStats.map((stat, i) => (
                    <div key={i} className={`rounded-lg p-6 text-center shadow-md bg-gradient-to-br ${stat.color} from-opacity-70 to-opacity-90`}>
                      <div className="text-2xl font-bold text-white animate-bounce">{stat.value}</div>
                      <div className="text-gray-100 text-sm mt-1">{stat.label}</div>
                    </div>
                ))}
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition flex items-center">
                Placement Report <ExternalLink size={16} className="ml-2" />
              </button>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mt-8 mb-6 text-white">Placement Distribution</h3>
                <div className="h-48 flex items-end gap-2">
                  <div className="w-1/4 bg-gradient-to-t from-blue-500 to-blue-300 h-36 rounded-t-lg animate-grow"></div>
                  <div className="w-1/4 bg-gradient-to-t from-green-500 to-green-300 h-28 rounded-t-lg animate-grow"></div>
                  <div className="w-1/4 bg-gradient-to-t from-orange-500 to-orange-300 h-40 rounded-t-lg animate-grow"></div>
                  <div className="w-1/4 bg-gradient-to-t from-purple-500 to-purple-300 h-20 rounded-t-lg animate-grow"></div>
                </div>
                <div className="flex text-xs text-center mt-2 text-gray-300">
                  <div className="w-1/4">IT Services</div>
                  <div className="w-1/4">Core</div>
                  <div className="w-1/4">Product</div>
                  <div className="w-1/4">Others</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campus Life */}
        <section className="py-16 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-orange-500">Campus</span> Life
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Experience a vibrant and enriching campus life at VIT-AP with modern facilities, clubs, events, sports, and cultural activities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CampusCard
                  title="Sports & Recreation"
                  description="World-class sports facilities including swimming pool, football ground, basketball courts, and indoor games."
                  image="//E1.jpeg"
              />
              <CampusCard
                  title="Clubs & Societies"
                  description="Over 40+ student clubs covering technology, arts, culture, social service, and entrepreneurship."
                  image="//E2.JPG"
              />
              <CampusCard
                  title="Events & Festivals"
                  description="Annual techno-cultural fest, hackathons, workshops, and conferences throughout the year."
                  image="//E3.JPG"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
              {/* Left: Info & Links */}
              <div className="flex-1 flex flex-col md:flex-row md:items-start gap-8">
                <div>
                  <div className="text-xl font-bold flex items-center mb-4">
                    <span className="text-orange-500">VIT</span>
                    <span className="mx-1 text-blue-400">AP</span>
                    <span className="ml-2 text-gray-300 text-sm">University</span>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Beside AP Secretariat, Near Vijayawada, Amaravati - 522237, Andhra Pradesh, India
                  </p>
                  <p className="text-gray-400 mb-2 flex items-center">
                    <Mail size={18} className="text-orange-500 mr-2" /> admissions@vitap.ac.in
                  </p>
                  <p className="text-gray-400 flex items-center">
                    <Phone size={18} className="text-orange-500 mr-2" /> +91-863-2370444
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-6 md:mt-0">
                  <a href="https://vitap.ac.in" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400 transition font-medium">Visit Official Site</a>
                  <a href="/auth" className="text-blue-400 hover:text-blue-300 transition font-medium">Login</a>
                  <a href="/auth" className="text-gray-300 hover:text-white transition font-medium">Sign Up</a>
                </div>
              </div>
              {/* Right: Map */}
              <div className="md:w-[340px] w-full mt-8 md:mt-0">
                <h4 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <MapPin size={20} className="text-orange-500" /> Location
                </h4>
                <div
                    style={{
                      borderRadius: "0.75rem",
                      overflow: "hidden",
                      boxShadow: "0 2px 16px #0008",
                      background: "#18181b",
                    }}
                >
                  <div
                      style={{
                        filter: "invert(90%) grayscale(1) contrast(1.2)",
                        width: "100%",
                        height: "220px",
                      }}
                  >
                    <iframe
                        title="VIT-AP Location"
                        width="100%"
                        height="220"
                        frameBorder="0"
                        style={{ border: 0, width: "100%", height: "100%" }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps?q=VIT-AP+University,+Beside+AP+Secretariat,+Near+Vijayawada,+Amaravati,+Andhra+Pradesh+522237&hl=en&z=15&output=embed"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-500 text-sm">
              © 2025 V-SPACE. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
  );
}
