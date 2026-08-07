export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const developerSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BCA Nepal",
  alternateName: "BCA Nepal - TU BCA Study Hub",
  url: "https://bcanepal.app",
  logo: "https://bcanepal.app/icons/fabi.jpg",
  description: "Free study companion for Tribhuvan University BCA students. Access semester notes, PDFs, handwritten notes, YouTube lectures, and track study progress — all offline.",
  foundingDate: "2024",
  founder: [
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
  },
};
