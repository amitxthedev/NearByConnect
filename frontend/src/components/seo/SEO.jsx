import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://nearbyconnect.fun';
const SITE_NAME = 'NearbyConnect';
const DEFAULT_IMAGE = '/tablogo.png';

export default function SEO({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  jsonLd,
  index = true,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Anonymous Local Communities`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'Connect with your city without revealing your identity. Join anonymous local communities for chat, events, and more.'} />
      {!index && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || 'Connect with your city without revealing your identity.'} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || 'Connect with your city without revealing your identity.'} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
