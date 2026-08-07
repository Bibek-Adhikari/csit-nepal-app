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
  name: "BCA Nepal",
  alternateName: ["BCA Nepal - TU BCA Study Hub", "BCA Study Hub"],
  url: "https://bcanepal.app",
  logo: {
    "@type": "ImageObject",
    url: "https://bcanepal.app/icons/fabi.jpg",
    width: 512,
    height: 512,
  },
  description: "Free study companion for Tribhuvan University BCA students. Access semester notes, PDFs, handwritten notes, YouTube lectures, and track study progress — all offline.",
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
    "https://github.com/Bibek-Adhikari/bca-nepal-app",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://github.com/Bibek-Adhikari/bca-nepal-app/issues",
    availableLanguage: ["English", "Nepali"],
  },
  keywords: ["BCA Nepal", "TU BCA", "Tribhuvan University", "BCA notes", "BCA study", "semester notes", "BCA PDF", "BCA lectures", "Nepal BCA"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BCA Nepal",
  alternateName: "BCA Nepal - TU BCA Study Hub",
  url: "https://bcanepal.app",
  description: "Free study companion for Tribhuvan University BCA students. Access semester notes, PDFs, handwritten notes, YouTube lectures, and track study progress — all offline.",
  publisher: {
    "@type": "Organization",
    name: "BCA Nepal",
    logo: {
      "@type": "ImageObject",
      url: "https://bcanepal.app/icons/fabi.jpg",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://bcanepal.app/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: ["en", "ne"],
  copyrightYear: 2024,
  copyrightHolder: {
    "@type": "Organization",
    name: "BCA Nepal",
  },
};

export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BCA Nepal",
  alternateName: "BCA Nepal - TU BCA Study Hub",
  url: "https://bcanepal.app",
  description: "Free study companion for TU BCA students. Browse notes, watch YouTube lectures, track progress.",
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
  screenshot: "https://bcanepal.app/icons/fabi.jpg",
  author: {
    "@type": "Organization",
    name: "BCA Nepal",
    url: "https://bcanepal.app",
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
      item: "https://bcanepal.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Subjects",
      item: "https://bcanepal.app/subjects",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Lectures",
      item: "https://bcanepal.app/lectures",
    },
  ],
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is BCA Nepal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BCA Nepal is a free study companion for Tribhuvan University BCA students. It provides semester notes, PDFs, handwritten notes, YouTube lectures, and progress tracking - all accessible offline.",
      },
    },
    {
      "@type": "Question",
      name: "Is BCA Nepal free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, BCA Nepal is completely free. All study materials including notes, PDFs, and video lectures are available at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "Can I access BCA Nepal offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, BCA Nepal works offline. Once you visit the site, study materials are cached for offline access using Progressive Web App technology.",
      },
    },
    {
      "@type": "Question",
      name: "Which semesters are available on BCA Nepal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BCA Nepal covers all 6 semesters of the Tribhuvan University BCA program, including subjects like Java, C Programming, Digital Logic, Mathematics, and UX/UI Design.",
      },
    },
  ],
};
