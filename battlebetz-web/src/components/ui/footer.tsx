"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Column */}
          <div className="col-span-1">
            <h3 className="text-purple-500 text-lg font-semibold mb-4">Company</h3>
            <div className="bg-gray-800/40 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">US Registered Company</p>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3">
              <p className="text-white text-sm">Locations: New York, Delaware, and Connecticut</p>
            </div>
            <div className="flex space-x-4 mt-6">
              <Link href="https://www.linkedin.com/in/battle-betz-6b0426356/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="bg-gray-800/40 p-2 rounded-md text-purple-400 hover:text-purple-300 transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="https://www.instagram.com/battlebetz/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-gray-800/40 p-2 rounded-md text-purple-400 hover:text-purple-300 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="https://x.com/i/flow/login?redirect_after_login=%2FBattleBetz1" target="_blank" rel="noopener noreferrer" aria-label="X" className="bg-gray-800/40 p-2 rounded-md text-purple-400 hover:text-purple-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Features Column */}
          <div className="col-span-1">
            <h3 className="text-purple-500 text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/arena" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Arena
                </Link>
              </li>
              <li>
                <Link href="/battles" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Battles
                </Link>
              </li>
              <li>
                <Link href="/art-of-war" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Art of War
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources Column */}
          <div className="col-span-1">
            <h3 className="text-purple-500 text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="https://cultivatingsolutions.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors text-sm">
                  Powered by Cultivating Solutions
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div className="col-span-1">
            <h3 className="text-purple-500 text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 