import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import SEO from '../components/seo/SEO';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Terms of Service"
        description="NearbyConnect terms of service. Read our community guidelines, platform rules, and user agreements for anonymous local communities."
        path="/terms"
        keywords="terms of service, community guidelines, platform rules, user agreement, nearbyconnect terms"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms of Service — NearbyConnect',
          description: 'Community guidelines and platform rules for NearbyConnect.',
          url: 'https://nearbyconnect.fun/terms',
          datePublished: '2026-07-18',
          dateModified: '2026-07-19',
        }}
      />
      <div className="max-w-3xl mx-auto px-5 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-sm text-gray-400 mb-8">Last updated: July 18, 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                By accessing or using NearbyConnect, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. Eligibility</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                You must be at least 13 years old to use NearbyConnect. By using the platform, you confirm you meet this age requirement.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Account & Identity</h2>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 ml-4">
                <li>You choose your own username — this is your identity on the platform</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>One account per person — no duplicate accounts</li>
                <li>You may change your anonymous identity at any time in Settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Community Guidelines</h2>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 ml-4">
                <li>Be respectful to other community members</li>
                <li>No harassment, hate speech, or threats</li>
                <li>No spam, self-promotion, or unsolicited advertising</li>
                <li>No sharing of illegal content or activities</li>
                <li>No impersonation of other users</li>
                <li>Respect the privacy and anonymity of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Content & Messaging</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Messages you send in community chats are visible to all members of that community. You retain ownership of your content, but grant NearbyConnect a license to display and store it within the platform. We reserve the right to remove content that violates these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Prohibited Activities</h2>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 ml-4">
                <li>Attempting to identify or dox other anonymous users</li>
                <li>Using the platform for illegal purposes</li>
                <li>Attempting to exploit or hack the platform</li>
                <li>Creating fake communities to mislead users</li>
                <li>Automated scraping or data collection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Termination</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms, without prior notice. You may delete your account at any time through Settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Disclaimer</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                NearbyConnect is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service. We are not responsible for the actions of users within communities.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Changes to Terms</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We may modify these terms at any time. Continued use of the platform after changes means you accept the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                For questions about these terms, reach out through the app's feedback channels or open an issue on our GitHub repository.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
