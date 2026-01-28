import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.png" />
        <title>Prajwal's Portfolio | Software Engineer</title>
        <meta
          name="description"
          content="I’m a software engineer and developer with a passion for building
          scalable systems, experimenting with new technologies, and sharing what
          I learn along the way."
        />
        <meta property="og:title" content="Prajwal's Portfolio" />
        <meta
          property="og:description"
          content="I’m a software engineer and developer with a passion for building
        scalable systems, experimenting with new technologies, and sharing what
        I learn along the way."
        />
        <meta property="og:image" content="/icon.png" />
        <meta property="og:url" content="https://07prajwal.github.io" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Prajwal's Portfolio" />
        <meta property="twitter:card" content="Prajwal's Portfolio" />
        <meta property="twitter:title" content="Prajwal's Portfolio" />
        <meta
          property="twitter:description"
          content="I’m a software engineer and developer with a passion for building
        scalable systems, experimenting with new technologies, and sharing what
        I learn along the way."
        />
        <meta property="twitter:image" content="/icon.png" />
        <meta property="twitter:url" content="https://07prajwal.github.io" />
      </Head>
      <body className="antialiased inter-400 bg-dark text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
