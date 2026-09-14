import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help & Support | BattleBetz',
  description: 'Get help with your BattleBetz account, tournaments, bets, and more. Find answers to frequently asked questions.',
};

export default function HelpPage() {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-900 to-gray-900">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help & Support</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How do I create an account?</h3>
              <p className="text-gray-300">
                Creating an account is easy! Click the "Sign Up" button in the top right corner of the page. Fill in your details, 
                verify your email address, and you're ready to go. You can also sign up using your Google or Facebook account for faster registration.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How do tournaments work?</h3>
              <p className="text-gray-300">
                Tournaments on BattleBetz are betting competitions where you can place bets on various matches within the tournament. 
                Points are awarded based on the accuracy of your predictions. The users with the most points at the end of the tournament 
                win prizes according to the tournament's prize structure.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How do I place a bet?</h3>
              <p className="text-gray-300">
                To place a bet, navigate to a tournament page and select a match you want to bet on. Choose your prediction, 
                enter the amount you want to bet, and confirm your bet. You'll see your active bets in your profile page under "My Bets."
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How are winnings calculated?</h3>
              <p className="text-gray-300">
                Winnings are calculated based on the odds provided for each bet option and the amount you bet. If your prediction is correct, 
                your winnings will be credited to your account automatically after the match results are confirmed.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How do I withdraw my winnings?</h3>
              <p className="text-gray-300">
                You can withdraw your winnings by navigating to your profile, selecting the "Wallet" section, and 
                clicking on "Withdraw." Follow the prompts to complete the withdrawal process. Processing times vary 
                depending on your chosen withdrawal method.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Is my personal information secure?</h3>
              <p className="text-gray-300">
                Yes, we take data security seriously. All personal information is encrypted and stored securely. 
                We never share your data with third parties without your consent. For more information, please see our 
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 ml-1">Privacy Policy</Link>.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How can I change my account settings?</h3>
              <p className="text-gray-300">
                You can change your account settings by clicking on your profile icon in the top right corner and selecting "Profile Settings." 
                From there, you can update your personal information, change your password, and adjust notification preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Still Need Help?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300 mb-4">
                Get a response within 24 hours.
              </p>
              <a href="mailto:support@battlebetz.com" className="text-purple-400 hover:text-purple-300">
                support@battlebetz.com
              </a>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-300 mb-4">
                Available 7 days a week, 9am - 10pm EST.
              </p>
              <button className="text-purple-400 hover:text-purple-300">
                Start Chat
              </button>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300 mb-4">
                For urgent issues.
              </p>
              <a href="tel:+18001234567" className="text-purple-400 hover:text-purple-300">
                +1 (800) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Help Topics Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Help Topics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Link href="/help/account" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors">
              <h3 className="text-xl font-semibold mb-2">Account Management</h3>
              <p className="text-gray-300">Registration, login, and account settings.</p>
            </Link>
            
            <Link href="/help/tournaments" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors">
              <h3 className="text-xl font-semibold mb-2">Tournaments</h3>
              <p className="text-gray-300">How tournaments work and how to participate.</p>
            </Link>
            
            <Link href="/help/betting" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors">
              <h3 className="text-xl font-semibold mb-2">Betting</h3>
              <p className="text-gray-300">How to place bets and understand odds.</p>
            </Link>
            
            <Link href="/help/payments" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors">
              <h3 className="text-xl font-semibold mb-2">Payments</h3>
              <p className="text-gray-300">Deposits, withdrawals, and payment methods.</p>
            </Link>
            
            <Link href="/help/security" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors">
              <h3 className="text-xl font-semibold mb-2">Security</h3>
              <p className="text-gray-300">Account security and privacy concerns.</p>
            </Link>
            
            <Link href="/help/terms" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition-colors">
              <h3 className="text-xl font-semibold mb-2">Terms & Policies</h3>
              <p className="text-gray-300">Terms of service and platform policies.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 