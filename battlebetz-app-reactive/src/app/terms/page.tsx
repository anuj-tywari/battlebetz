import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | BattleBetz',
  description: 'BattleBetz Terms of Service - Rules and regulations for using our platform',
};

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-gray-400 mb-4">Last Updated: June 10, 2023</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Welcome to BattleBetz. Please read these Terms of Service ("Terms") carefully before using our website and services.
              By accessing or using BattleBetz, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Account Registration and Eligibility</h2>
            <p className="text-gray-300 mb-4">
              To use certain features of BattleBetz, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself.
            </p>
            <p className="text-gray-300 mb-4">
              You must be at least 18 years old to create an account and use our services. By creating an account, you represent that:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>You are at least 18 years old</li>
              <li>You are legally permitted to use the services in your jurisdiction</li>
              <li>You are not prohibited from participating in online gaming or betting activities</li>
              <li>You are creating an account for your own personal use, not on behalf of any other person</li>
            </ul>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">2. User Conduct</h2>
            <p className="text-gray-300 mb-4">
              When using BattleBetz, you agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Use the services for any illegal or unauthorized purpose</li>
              <li>Create multiple accounts for the same person</li>
              <li>Provide false or misleading information</li>
              <li>Use any automated system or software to extract data from our website</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Engage in any activity that disrupts or interferes with our services</li>
              <li>Harass, threaten, or intimidate other users</li>
            </ul>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Deposits and Withdrawals</h2>
            <p className="text-gray-300 mb-4">
              You may deposit funds into your account using the payment methods we offer. You are responsible for ensuring that:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>You have sufficient funds for any deposits you make</li>
              <li>You are using payment methods that belong to you</li>
              <li>You are not engaged in any fraudulent activities</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Withdrawals may be subject to verification checks, processing times, and minimum withdrawal amounts. We reserve the right to refuse withdrawals if we suspect fraudulent activity.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Tournaments and Betting</h2>
            <p className="text-gray-300 mb-4">
              By participating in tournaments and placing bets on BattleBetz, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>All tournament rules are subject to change at our discretion</li>
              <li>Our decisions regarding the outcome of bets are final</li>
              <li>You are responsible for understanding the rules of each tournament before participating</li>
              <li>We may cancel or modify tournaments at any time</li>
              <li>We may limit or restrict your ability to place bets at our discretion</li>
            </ul>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Responsible Gaming</h2>
            <p className="text-gray-300 mb-4">
              BattleBetz is committed to promoting responsible gaming. We offer tools to help you control your gaming activity, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Deposit limits</li>
              <li>Time limits</li>
              <li>Self-exclusion options</li>
            </ul>
            <p className="text-gray-300 mb-4">
              If you believe you may have a gambling problem, please contact a professional organization that can provide assistance.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              All content on BattleBetz, including text, graphics, logos, icons, images, audio clips, and software, is the property of BattleBetz or its licensors and is protected by copyright and other intellectual property laws.
            </p>
            <p className="text-gray-300 mb-4">
              You may not reproduce, modify, distribute, or publicly display any content from our website without our written permission.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              To the fullest extent permitted by law, BattleBetz shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of our services.
            </p>
            <p className="text-gray-300 mb-4">
              Our total liability for any claims arising from these Terms shall not exceed the amount you have deposited in your account in the six months preceding the claim.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">8. Dispute Resolution</h2>
            <p className="text-gray-300 mb-4">
              Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in Las Vegas, Nevada.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">9. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your account and access to our services at any time, without notice, for any reason, including if we believe you have violated these Terms.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-300 mb-4">
              We may modify these Terms at any time by posting the revised Terms on our website. Your continued use of our services after any changes constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">11. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">Email:</strong> terms@battlebetz.com<br />
              <strong className="text-white">Address:</strong> 123 Gaming Street, Suite 456, Las Vegas, NV 89101
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 