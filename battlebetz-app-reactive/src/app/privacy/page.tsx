import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy | BattleBetz',
  description: 'BattleBetz Privacy Policy - Learn how we collect, use, and protect your personal information',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-gray-800 rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-gray-400 mb-4">Last Updated: June 10, 2023</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              At BattleBetz, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or use our services.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-white mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-300 mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Register for an account</li>
              <li>Participate in tournaments or place bets</li>
              <li>Make deposits or withdrawals</li>
              <li>Contact our customer support</li>
              <li>Complete surveys or provide feedback</li>
            </ul>
            <p className="text-gray-300 mb-4">
              This information may include your name, email address, postal address, phone number, date of birth, 
              and payment information.
            </p>
            
            <h3 className="text-lg font-medium text-white mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-300 mb-4">
              When you access our website, we may automatically collect certain information about your device, 
              including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referral source</li>
              <li>Length of visit and pages viewed</li>
              <li>Other technical information</li>
            </ul>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and managing your account</li>
              <li>Verifying your identity and preventing fraud</li>
              <li>Sending you important information, updates, and promotional materials</li>
              <li>Improving our website and user experience</li>
              <li>Complying with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">Disclosure of Your Information</h2>
            <p className="text-gray-300 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Service providers who assist us in operating our website and conducting business</li>
              <li>Financial institutions and payment processors to facilitate transactions</li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>Business partners for marketing purposes (with your consent)</li>
            </ul>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">Your Rights</h2>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Objection to or restriction of processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">Cookie Policy</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website. You can set your 
              browser to refuse all or some browser cookies, but this may affect your ability to use certain features of 
              our website.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">Changes to this Privacy Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">Email:</strong> privacy@battlebetz.com<br />
              <strong className="text-white">Address:</strong> 123 Gaming Street, Suite 456, Las Vegas, NV 89101
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 