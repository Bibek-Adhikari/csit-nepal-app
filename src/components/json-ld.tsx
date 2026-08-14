export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CSIT Nepal",
  alternateName: ["CSIT Nepal - TU BSc CSIT Study Hub", "CSIT Study Hub"],
  url: "https://csitnepal.vercel.app",
  logo: {
    "@type": "ImageObject",
    url: "https://csitnepal.vercel.app/icons/fabi.jpg",
    width: 512,
    height: 512,
  },
  description: "Free study companion for Tribhuvan University BSc CSIT students. Access semester notes, PDFs, handwritten notes, YouTube lectures, and track study progress — all offline.",
  foundingDate: "2024",
  founders: [
    {
      "@type": "Person",
      name: "Rupesh Adhikari",
      sameAs: [
        "https://www.facebook.com/rupesh.adhikari.219",
        "https://www.instagram.com/rupeshadhikari219",
        "https://github.com/bcanepal219",
      ],
    },
    {
      "@type": "Person",
      name: "Bibek Adhikari",
      sameAs: [
        "https://facebook.com/bibek.adhikari.9279807",
        "https://instagram.com/crazy_bibek22",
        "https://linkedin.com/in/bibek-adhikari-24149b2b3",
        "https://github.com/Bibek-Adhikari",
      ],
    },
  ],
  sameAs: [
    "https://github.com/Bibek-Adhikari/csit-nepal-app",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://github.com/Bibek-Adhikari/csit-nepal-app/issues",
    availableLanguage: ["English", "Nepali"],
  },
  keywords: ["CSIT Nepal", "TU CSIT", "BSc CSIT", "Tribhuvan University", "CSIT notes", "CSIT study", "semester notes", "CSIT PDF", "CSIT lectures", "Nepal CSIT"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CSIT Nepal",
  alternateName: "CSIT Nepal - TU BSc CSIT Study Hub",
  url: "https://csitnepal.vercel.app",
  description: "Free study companion for Tribhuvan University BSc CSIT students. Access semester notes, PDFs, handwritten notes, YouTube lectures, and track study progress — all offline.",
  publisher: {
    "@type": "Organization",
    name: "CSIT Nepal",
    logo: {
      "@type": "ImageObject",
      url: "https://csitnepal.vercel.app/icons/fabi.jpg",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://csitnepal.vercel.app/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: ["en", "ne"],
  copyrightYear: 2024,
  copyrightHolder: {
    "@type": "Organization",
    name: "CSIT Nepal",
  },
};

export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSIT Nepal",
  alternateName: "CSIT Nepal - TU BSc CSIT Study Hub",
  url: "https://csitnepal.vercel.app",
  description: "Free study companion for TU BSc CSIT students. Browse notes, watch YouTube lectures, track progress.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "500",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Semester Notes",
    "PDF Downloads",
    "Handwritten Notes",
    "YouTube Lectures",
    "Progress Tracking",
    "Offline Access",
    "Quiz System",
  ],
  screenshot: "https://csitnepal.vercel.app/icons/fabi.jpg",
  author: {
    "@type": "Organization",
    name: "CSIT Nepal",
    url: "https://csitnepal.vercel.app",
  },
  maintainer: [
    {
      "@type": "Person",
      name: "Rupesh Adhikari",
      url: "https://github.com/bcanepal219",
    },
    {
      "@type": "Person",
      name: "Bibek Adhikari",
      url: "https://github.com/Bibek-Adhikari",
    },
  ],
};

export const breadcrumbHomeSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://csitnepal.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Subjects",
      item: "https://csitnepal.vercel.app/subjects",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Lectures",
      item: "https://csitnepal.vercel.app/lectures",
    },
  ],
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is CSIT Nepal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CSIT Nepal is a free study companion for Tribhuvan University BSc CSIT students. It provides semester notes, PDFs, handwritten notes, YouTube lectures, and progress tracking - all accessible offline.",
      },
    },
    {
      "@type": "Question",
      name: "Is CSIT Nepal free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, CSIT Nepal is completely free. All study materials including notes, PDFs, and video lectures are available at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "Can I access CSIT Nepal offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, CSIT Nepal works offline. Once you visit the site, study materials are cached for offline access using Progressive Web App technology.",
      },
    },
    {
      "@type": "Question",
      name: "Which semesters are available on CSIT Nepal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CSIT Nepal covers all 8 semesters of the Tribhuvan University BSc CSIT program, including subjects like C Programming, Digital Logic, Discrete Structures, Object-Oriented Programming, and Microprocessor.",
      },
    },
  ],
};