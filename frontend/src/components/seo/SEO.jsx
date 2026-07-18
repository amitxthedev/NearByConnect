import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://nearbyconnect.fun';
const SITE_NAME = 'NearbyConnect';
const DEFAULT_IMAGE = `${SITE_URL}/brandlogo.png`;
const DEFAULT_IMAGE_ALT = 'NearbyConnect — Anonymous Local Communities';

export default function SEO({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  jsonLd,
  index = true,
  keywords,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Anonymous Local Communities`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'Connect with your city without revealing your identity. Join anonymous local communities for chat, events, and more.'} />
      {keywords && <meta name="keywords" content={keywords} />}
      {!index && <meta name="robots" content="noindex, nofollow" />}
      {index && <meta name="robots" content="index, follow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || 'Connect with your city without revealing your identity.'} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title || DEFAULT_IMAGE_ALT} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || 'Connect with your city without revealing your identity.'} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title || SITE_NAME} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
}

export const SITE_URL_CONST = SITE_URL;
export const SITE_NAME_CONST = SITE_NAME;
