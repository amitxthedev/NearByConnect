import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import SEO from '../components/seo/SEO';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Privacy Policy"
        description="NearbyConnect privacy policy. Learn how we protect your anonymous identity and keep your data safe. No real names, emails, or GPS tracking required."
        path="/privacy"
        keywords="privacy policy, anonymous privacy, data protection, user privacy, nearbyconnect privacy"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy — NearbyConnect',
          description: 'Learn how NearbyConnect protects your anonymous identity.',
          url: 'https://nearbyconnect.fun/privacy',
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
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-sm text-gray-400 mb-8">Last updated: July 18, 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                NearbyConnect is designed around anonymity. We collect minimal information to provide our services:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1.5 ml-4">
                <li><strong>Account info:</strong> Username and password (encrypted). No real names, emails, or phone numbers required.</li>
                <li><strong>Location:</strong> City you select during signup. Used to show local communities. Approximate only — we never track precise GPS location.</li>
                <li><strong>Interests:</strong> Topics you choose to match with relevant communities.</li>
                <li><strong>Usage data:</strong> Messages you send, communities you join, and basic app usage patterns for improving the service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 ml-4">
                <li>To provide and maintain the NearbyConnect service</li>
                <li>To match you with local communities based on your city and interests</li>
                <li>To enable messaging between community members</li>
                <li>To improve and optimize the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. What We Don't Do</h2>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 ml-4">
                <li>We <strong>never</strong> sell your data to third parties</li>
                <li>We <strong>never</strong> track your precise GPS location</li>
                <li>We <strong>never</strong> require real names, emails, or phone numbers</li>
                <li>We <strong>never</strong> run targeted advertising on your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Data Storage & Security</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your data is stored on secure servers with industry-standard encryption. Messages are stored in encrypted databases. We use HTTPS for all communications. While we take every reasonable precaution, no method of transmission or storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Retention</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We retain your data for as long as your account is active. If you delete your account, all personal data is permanently removed within 30 days. Messages in community chats may persist in anonymized form.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Your Rights</h2>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 ml-4">
                <li>View and edit your profile at any time in Settings</li>
                <li>Delete your account and all associated data</li>
                <li>Change your anonymous identity</li>
                <li>Exit any community at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Changes to This Policy</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. Significant changes will be communicated through the app. Continued use of NearbyConnect after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Contact</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Questions about this policy? Reach out through the app's feedback channels or open an issue on our GitHub repository.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
