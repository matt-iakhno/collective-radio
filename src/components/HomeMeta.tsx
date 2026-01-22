import { Helmet } from "react-helmet-async";

/**
 * Default meta tags for the homepage
 * These are overridden by EpisodePage for episode routes
 */
export default function HomeMeta() {
  return (
    <Helmet>
      <title>Collective Radio</title>
      <meta name="description" content="A multi-genre DJ mix podcast based in Vancouver, Canada." />
      <link rel="canonical" href="https://www.collectiveradio.com/" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Collective Radio" />
      <meta property="og:description" content="A multi-genre DJ mix podcast based in Vancouver, Canada." />
      <meta property="og:image" content="https://www.collectiveradio.com/og-image.jpg" />
      <meta property="og:url" content="https://www.collectiveradio.com/" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Collective Radio" />
      <meta name="twitter:description" content="A multi-genre DJ mix podcast based in Vancouver, Canada." />
      <meta name="twitter:image" content="https://www.collectiveradio.com/og-image.jpg" />
    </Helmet>
  );
}
