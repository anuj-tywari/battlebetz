"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

// FAQ item component with accordion functionality
const FaqItem = ({ question, answer, isOpen, toggle }: { 
  question: string; 
  answer: string | React.ReactNode; 
  isOpen: boolean; 
  toggle: () => void 
}) => {
  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full text-left py-5 flex justify-between items-center focus:outline-none"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-purple-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-purple-400" />
          )}
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <div className="text-gray-300 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

// FAQ category component
const FaqCategory = ({ title, faqs }: { title: string; faqs: { question: string; answer: string | React.ReactNode }[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
      <div className="divide-y divide-gray-700 border-t border-gray-700">
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            toggle={() => toggleFaq(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default function FaqPage() {
  // FAQ data organized by category
  const generalFaqs = [
    {
      question: "What is BattleBetz?",
      answer: "BattleBetz is a social sports prediction platform where users can join tournaments, make predictions on sporting events, and compete with friends and other sports fans. Our platform combines the excitement of sports betting with the social aspect of competition."
    },
    {
      question: "Is BattleBetz legal?",
      answer: "Yes, BattleBetz operates as a skill-based prediction platform in jurisdictions where such contests are permitted. We comply with all relevant regulations and laws regarding online gaming and sports prediction contests."
    },
    {
      question: "How old do I need to be to use BattleBetz?",
      answer: "You must be at least 18 years old (or the legal age of majority in your jurisdiction, if higher) to create an account and participate in tournaments on BattleBetz."
    },
    {
      question: "Which sports are available on BattleBetz?",
      answer: "We currently offer tournaments for major sports including football (NFL), basketball (NBA), baseball (MLB), hockey (NHL), soccer (major leagues and international tournaments), and esports. We regularly add new sports and events based on user demand and seasonal schedules."
    }
  ];

  const accountFaqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the top-right corner of the page. You'll need to provide a valid email address, create a password, and choose a username. Once you've completed the registration form, you'll receive a verification email to confirm your account."
    },
    {
      question: "Can I change my username or email address?",
      answer: "You can change your username in your profile settings. However, to change your email address, you'll need to contact our support team for security reasons."
    },
    {
      question: "How do I reset my password?",
      answer: "If you've forgotten your password, click on the 'Forgot Password' link on the login page. You'll be prompted to enter your email address, and we'll send you instructions to reset your password."
    },
    {
      question: "How can I delete my account?",
      answer: "To delete your account, go to your account settings and select the 'Delete Account' option. Please note that this action is permanent and will remove all your data from our platform after any pending transactions are completed."
    }
  ];

  const tournamentFaqs = [
    {
      question: "How do tournaments work?",
      answer: "Tournaments on BattleBetz are structured competitions where participants make predictions on sporting events. Each tournament has specific rules, entry fees, and prize structures. Participants earn points based on the accuracy of their predictions, and winners are determined by their ranking on the leaderboard at the end of the tournament."
    },
    {
      question: "How do I join a tournament?",
      answer: "To join a tournament, browse the available tournaments on our platform, select one that interests you, and click the 'Join Tournament' button. You'll need to pay the entry fee (if applicable) and agree to the tournament rules before participating."
    },
    {
      question: "What happens if a match is canceled or postponed?",
      answer: "If a match is canceled or postponed beyond the tournament window, predictions for that match will be nullified. The tournament will continue with the remaining matches, and points will be calculated accordingly. In some cases, we may replace the canceled match with another suitable match at our discretion."
    },
    {
      question: "Can I create my own tournaments?",
      answer: "Yes! Premium members can create private tournaments and invite friends to join. You can customize the entry fee, prize structure, and pick the matches included in your tournament."
    }
  ];

  const bettingFaqs = [
    {
      question: "How do I place a bet?",
      answer: "Once you've joined a tournament, you can place your predictions ('bets') on the matches included in that tournament. Navigate to the tournament page, select a match, choose your prediction (win, loss, or draw), and enter your stake amount within the allowed limits."
    },
    {
      question: "What are the odds and how are they calculated?",
      answer: "The odds on BattleBetz reflect the probability of a particular outcome occurring. They are initially set based on current market odds and may adjust based on betting activity on our platform. The odds determine your potential payout if your prediction is correct."
    },
    {
      question: "Is there a minimum or maximum bet amount?",
      answer: "Yes, each tournament has its own minimum and maximum bet limits. These limits are clearly displayed when you're placing a bet. Additionally, you cannot bet more than the available balance in your account."
    },
    {
      question: "How are winnings calculated?",
      answer: "Winnings are calculated by multiplying your stake by the odds at the time you placed your bet. For example, if you bet $10 at odds of 2.0, your potential winnings would be $20 (including your original stake)."
    }
  ];

  const paymentFaqs = [
    {
      question: "How do I deposit funds into my account?",
      answer: "To deposit funds, go to your account dashboard and click on 'Deposit'. We accept various payment methods including credit/debit cards, PayPal, and cryptocurrency. Follow the instructions on the deposit page to complete your transaction."
    },
    {
      question: "How do I withdraw my winnings?",
      answer: "To withdraw your winnings, go to your account dashboard and click on 'Withdraw'. You can withdraw funds using the same method you used for depositing. Please note that verification may be required for your first withdrawal."
    },
    {
      question: "Are there any fees for deposits or withdrawals?",
      answer: "BattleBetz does not charge fees for deposits. However, some payment processors may apply their own fees. For withdrawals, there may be a small processing fee depending on the withdrawal method. All fees are clearly displayed before you confirm your transaction."
    },
    {
      question: "How long do withdrawals take to process?",
      answer: "Withdrawal processing times vary depending on the method used. Cryptocurrency withdrawals are typically processed within 24 hours. Bank transfers and credit card withdrawals may take 2-5 business days. PayPal withdrawals are usually processed within 24-48 hours."
    }
  ];

  return (
    <div className="bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-300">
              Find answers to common questions about BattleBetz. Can't find what you're looking for?
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center mt-4 text-purple-400 hover:text-purple-300"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact our support team
            </Link>
          </div>

          {/* FAQ categories */}
          <div className="space-y-12">
            <FaqCategory title="General Questions" faqs={generalFaqs} />
            <FaqCategory title="Account & Profile" faqs={accountFaqs} />
            <FaqCategory title="Tournaments" faqs={tournamentFaqs} />
            <FaqCategory title="Betting & Predictions" faqs={bettingFaqs} />
            <FaqCategory title="Payments & Withdrawals" faqs={paymentFaqs} />
          </div>

          {/* Contact support section */}
          <div className="mt-20 bg-gray-800 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-gray-300 mb-6">
              Our support team is here to help. We typically respond within 24 hours.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 