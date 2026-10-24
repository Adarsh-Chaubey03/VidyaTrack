import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { assets } from '../../assets/assets';

/* ── Small icon helpers for link rows ── */
const BookIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const UsersIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const EditIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const HelpIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const HeadsetIcon= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
const FileIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const ShieldIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const MsgIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const MailIcon2  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

const LINK_CLS = 'flex items-center gap-2.5 text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-150';

function Footer() {
  return (
    <footer className="w-full bg-[#042d1e]">
      {/* ── Main content ── */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── Brand ── */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center">
              <img
                src={assets.logo}
                alt="VidyaTrack"
                className="w-32 sm:w-36"
                style={{ filter: 'brightness(1.1)' }}
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
              Empowering learners with world-class education anywhere, anytime.
            </p>
            {/* Social icons — dark rounded squares, matching image */}
            <div className="flex items-center gap-2 mt-1">
              {[
                { icon: <Linkedin size={16} />,   href: '#' },
                { icon: <Twitter size={16} />,    href: '#' },
                { icon: <Instagram size={16} />,  href: '#' },
                { icon: <Mail size={16} />,       href: '#' },
              ].map(({ icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl bg-[#0d3d28] hover:bg-emerald-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-150"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Explore ── */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-base font-bold">Explore</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/course-list" className={LINK_CLS}><BookIcon />Courses</Link></li>
              <li><Link to="/about"       className={LINK_CLS}><UsersIcon />About Us</Link></li>
              <li><Link to="/blog"        className={LINK_CLS}><EditIcon />Blog</Link></li>
              <li><Link to="/faqs"        className={LINK_CLS}><HelpIcon />FAQs</Link></li>
            </ul>
          </div>

          {/* ── Support ── */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-base font-bold">Support</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/contact"        className={LINK_CLS}><HeadsetIcon />Contact Us</Link></li>
              <li><Link to="/terms"          className={LINK_CLS}><FileIcon />Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className={LINK_CLS}><ShieldIcon />Privacy Policy</Link></li>
              <li><Link to="/feedback"       className={LINK_CLS}><MsgIcon />Feedback</Link></li>
            </ul>
          </div>

          {/* ── Stay Updated ── */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-base font-bold">Stay Updated</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join our newsletter for the latest updates, learning resources, and offers.
            </p>
            <form
              className="flex items-center gap-0 bg-[#0d3d28] border border-[#1a5438] rounded-xl overflow-hidden pr-1 py-1 pl-3"
              onSubmit={e => e.preventDefault()}
            >
              <MailIcon2 />
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none ml-2"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors duration-150 shrink-0"
              >
                Subscribe <span className="text-base leading-none">→</span>
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#1a3d2b]">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} VidyaTrack. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-px h-4 bg-[#1a3d2b] hidden sm:block mx-2" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981" stroke="none"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
            <p className="text-gray-500 text-xs sm:text-sm">Made by Adarsh Chaubey</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
