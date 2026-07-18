import LandingNavbar from '../components/layout/LandingNavbar';
import Hero from '../components/landing/Hero';
import SocialProof from '../components/landing/SocialProof';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Stats from '../components/landing/Stats';
import CommunityPreview from '../components/landing/CommunityPreview';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import SEO from '../components/seo/SEO';


export default function LandingPage() {
  return (
    <div className="min-h-[100dvh]">
      <SEO
        title={null}
        description="Connect with your city without revealing your identity. Join anonymous local communities for chat, events, and more."
        path="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'NearbyConnect',
            url: 'https://nearbyconnect.fun',
            logo: 'https://nearbyconnect.fun/brandlogo.png',
            description: 'Anonymous local communities. Connect with your city without revealing who you are.',
            sameAs: [],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'NearbyConnect',
            url: 'https://nearbyconnect.fun',
            description: 'Anonymous local communities. Connect with your city without revealing who you are.',
            applicationCategory: 'SocialNetworkingApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is NearbyConnect?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'NearbyConnect is an anonymous local community platform that lets you connect with people in your city without revealing your identity.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is NearbyConnect free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, NearbyConnect is completely free to use. You can join communities, chat with locals, and participate in events at no cost.',
                },
              },
              {
                '@type': 'Question',
                name: 'How does anonymity work on NearbyConnect?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'When you sign up, you choose an anonymous username. Your real identity is never shared with other users.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I join multiple communities?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, you can join as many local communities as you want based on your interests and city.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I start chatting with my local community?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Join a community that matches your interests and location, then open the community chat to start talking with other anonymous members.',
                },
              },
            ],
          },
        ]}
      />
      <LandingNavbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Stats />
      <CommunityPreview />
      <CTA />
      <Footer />
    </div>
  );
}
