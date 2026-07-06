import { Link } from "react-router-dom";
import { BarChart3, BriefcaseBusiness, CheckCircle2, FileSearch, Search, Sparkles, Users } from "lucide-react";
import { Github, Instagram, Linkedin, Mail, Youtube } from "lucide-react";

function Home() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dashboardRoute = user?.role === "client" ? "/client-dashboard" : "/user-dashboard";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eaf1fb]">
      <div className="w-full overflow-hidden bg-white">
        <div className="bg-[#1e3a8a] px-4 py-2 text-center text-xs text-blue-50">
          See SmartHire in action in our next live demo webinar{" "}
          <span className="cursor-pointer font-semibold underline">Register now</span>
        </div>

        <header className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-2 border-b border-blue-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-[#1e3a8a]">
            <BriefcaseBusiness size={20} />
            SmartHire
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#platform" className="hover:text-[#1e3a8a]">
              Platform
            </a>
            <a href="#features" className="hover:text-[#1e3a8a]">
              Features
            </a>
            <a href="#about" className="hover:text-[#1e3a8a]">
              About
            </a>
            <a href="#contact" className="hover:text-[#1e3a8a]">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {token ? (
              <Link
                to={dashboardRoute}
                className="rounded-full bg-[#1e3a8a] px-3 py-2 text-xs font-medium text-white sm:px-5 sm:text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 sm:px-5 sm:text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="hidden rounded-full bg-[#3b82f6] px-3 py-2 text-xs font-medium text-white sm:inline-block sm:px-5 sm:text-sm"
                >
                  Request a demo
                </Link>
              </>
            )}
            <button className="hidden text-slate-500 sm:block">
              <Search size={16} />
            </button>
          </div>
        </header>

        <section id="platform" className="relative overflow-hidden bg-[url('/istockphoto-1473121061-612x612.jpg')] bg-cover bg-center px-4 py-8 sm:px-6 md:px-10 md:py-14">
          <div className="absolute inset-0 bg-white/68" />

          <div className="relative mx-auto w-full max-w-[1200px]">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h1 className="text-4xl font-semibold leading-tight text-[#1e3a8a] sm:text-5xl md:text-6xl">
                  The only internship
                  <br />
                  platform you&apos;ll
                  <br />
                  ever need
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                  Save time, apply with confidence, and move faster with AI-powered tools that streamline
                  every step from resume analysis to internship onboarding.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {token ? (
                    <Link
                      to={dashboardRoute}
                      className="btn rounded-full bg-[#1e3a8a] px-6 py-3 text-sm text-white"
                    >
                      Continue to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        className="btn rounded-full bg-[#1e3a8a] px-6 py-3 text-sm text-white"
                      >
                        Explore platform
                      </Link>
                      <Link
                        to="/login"
                        className="btn rounded-full border border-blue-200 bg-white px-6 py-3 text-sm text-[#1e3a8a]"
                      >
                        Request a demo
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="relative min-h-[300px] sm:min-h-[420px]">
                <div className="absolute right-0 top-0 z-20 hidden w-64 rounded-xl border border-blue-100 bg-white/95 p-4 shadow sm:block">
                  <p className="text-xs font-semibold text-slate-500">Candidate analytics score</p>
                  <div className="mt-3 h-2 rounded bg-blue-100">
                    <div className="h-2 w-4/5 rounded bg-[#3b82f6]" />
                  </div>
                  <div className="mt-2 h-2 rounded bg-blue-100">
                    <div className="h-2 w-3/5 rounded bg-[#60a5fa]" />
                  </div>
                </div>
                <div className="absolute left-0 top-10 z-20 hidden w-56 rounded-xl border border-blue-100 bg-white/95 p-4 shadow sm:block">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1e3a8a]">
                    <Users size={15} /> View all candidates
                  </div>
                  <p className="mt-2 text-xs text-slate-500">+ Scorecards generated instantly</p>
                </div>
                <div className="absolute -bottom-10 right-0 z-20 hidden w-64 rounded-xl border border-blue-100 bg-white/95 p-4 shadow sm:block">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1e3a8a]">
                    <FileSearch size={15} /> Resume analysis
                  </div>
                  <p className="mt-2 text-xs text-slate-500">ATS + Missing skills + Learning roadmap</p>
                </div>
                <img
                  src="/internship-job-program-illustration-vector-removebg-preview.png"
                  alt="Internship collaboration"
                  className="absolute left-1/2 top-10 z-10 w-[22rem] max-w-none -translate-x-1/2 sm:left-auto sm:right-6 sm:top-20 sm:w-80 sm:translate-x-0 md:w-[500px]"
                />
              </div>
            </div>

            <div className="mt-16">
              <p className="text-center text-[11px] font-medium text-slate-500">Minimal Flow</p>
              <div className="mt-2 grid gap-3 text-center md:grid-cols-3">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#1e3a8a]">
                  <Sparkles size={13} />
                  <span>Make smarter decisions</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#1e3a8a]">
                  <BarChart3 size={13} />
                  <span>Get data-backed insights</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#1e3a8a]">
                  <CheckCircle2 size={13} />
                  <span>Shortlist with confidence</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-blue-100 bg-white px-4 py-8 sm:px-6">
          <div className="mx-auto grid w-full max-w-[1200px] gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-[#f8fbff] to-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[#1e3a8a]">
                <BriefcaseBusiness size={16} />
                <p className="text-[11px] font-medium tracking-wide text-slate-500">TOTAL INTERNSHIPS POSTED</p>
              </div>
              <p className="font-numbers mt-3 text-4xl font-semibold text-[#1e3a8a]">+22k</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-[#f8fbff] to-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[#1e3a8a]">
                <FileSearch size={16} />
                <p className="text-[11px] font-medium tracking-wide text-slate-500">RESUMES ANALYZED MONTHLY</p>
              </div>
              <p className="font-numbers mt-3 text-4xl font-semibold text-[#1e3a8a]">+33k</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-[#f8fbff] to-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[#1e3a8a]">
                <Users size={16} />
                <p className="text-[11px] font-medium tracking-wide text-slate-500">SHORTLISTED CANDIDATES</p>
              </div>
              <p className="font-numbers mt-3 text-4xl font-semibold text-[#1e3a8a]">+44k</p>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-blue-100 bg-[#f8fbff] px-4 py-10 sm:px-6 sm:py-12">
          <div className="mx-auto w-full max-w-[1200px]">
            <h2 className="text-center text-3xl font-semibold text-[#1e3a8a]">
              Features for Students and Clients
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-slate-600">
              SmartHire is built for both sides of the internship ecosystem, helping students grow
              and helping companies hire faster with better insights.
            </p>

            <div className="mt-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#1e3a8a]">For Students (Users)</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700">
                    <li>Upload resume PDF and get ATS score instantly.</li>
                    <li>Find internships and apply with one workflow.</li>
                    <li>Get missing skills detection and roadmap suggestions.</li>
                    <li>Track application status: Applied, Shortlisted, Rejected.</li>
                    <li>Use AI assistant for career guidance and learning help.</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center p-2">
                  <img
                    src="/—Pngtree—business meeting with client illustration_4853425.png"
                    alt="Students using SmartHire"
                    className="h-56 w-auto object-contain md:h-64"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center justify-center p-2">
                  <img
                    src="/—Pngtree—client meeting vector concept color_14954962.png"
                    alt="Clients reviewing candidates"
                    className="h-56 w-auto -scale-x-100 object-contain md:h-64"
                  />
                </div>
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#1e3a8a]">For Clients</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700">
                    <li>Post internships/jobs with required skills and deadlines.</li>
                    <li>Review applicants sorted by ATS and skill match score.</li>
                    <li>Shortlist or reject candidates with a single click.</li>
                    <li>Generate WhatsApp links to contact selected students.</li>
                    <li>Use dashboard metrics to monitor hiring performance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="about" className="relative mt-2 min-h-[520px] overflow-hidden bg-[#0f234a]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#1f4ea1_0%,transparent_60%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-12 text-blue-100 sm:px-6 sm:py-14">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <h4 className="text-sm font-semibold text-white">Product Features</h4>
                <ul className="mt-3 space-y-2 text-xs text-blue-200">
                  <li>Resume ATS Analyzer</li>
                  <li>Skill Gap Detection</li>
                  <li>Learning Roadmap</li>
                  <li>Job Match Insights</li>
                  <li>Application Tracking</li>
                  <li>Career Guidance Insights</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">For Students</h4>
                <ul className="mt-3 space-y-2 text-xs text-blue-200">
                  <li>Build Resume Score</li>
                  <li>Apply to Internships</li>
                  <li>Track Application Status</li>
                  <li>Find Missing Skills</li>
                  <li>Recommended Roles</li>
                  <li>Career Growth Path</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">For Clients</h4>
                <ul className="mt-3 space-y-2 text-xs text-blue-200">
                  <li>Post Internships</li>
                  <li>Review Applicants</li>
                  <li>Sort by ATS Score</li>
                  <li>Shortlist / Reject</li>
                  <li>Send WhatsApp Alerts</li>
                  <li>Hiring Analytics</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">Resources</h4>
                <ul className="mt-3 space-y-2 text-xs text-blue-200">
                  <li>Resume Templates</li>
                  <li>Interview Preparation</li>
                  <li>Skill Learning Tracks</li>
                  <li>Project Ideas</li>
                  <li>Placement Guides</li>
                  <li>Community Support</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">Support</h4>
                <ul className="mt-3 space-y-2 text-xs text-blue-200">
                  <li>help@smarthire.io</li>
                  <li>Mon-Fri 9 AM - 6 PM</li>
                  <li>Knowledge Base</li>
                  <li>FAQ</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>

            <div id="contact" className="mt-10 flex items-center justify-center gap-4 border-y border-blue-400/25 py-4 text-blue-100">
              <Github size={16} />
              <Linkedin size={16} />
              <Youtube size={16} />
              <Instagram size={16} />
              <Mail size={16} />
            </div>

            <div className="mt-6 text-center">
              <p className="text-2xl font-semibold tracking-wide text-white">SmartHire</p>
              <p className="mt-2 text-xs text-blue-200">
                Internship & Resume Intelligence Platform - built for students and recruiters.
              </p>
              <p className="mt-2 text-[11px] text-blue-300">© 2026 SmartHire. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
