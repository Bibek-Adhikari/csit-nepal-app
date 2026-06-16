import type { Semester } from "../types";

export const semester2: Semester = {
  key: "semester-2",
  label: "Semester 2",
  overview: "Discrete structures, architecture, Java, mathematics, UX, and management.",
  subjects: [
    {
      code: "CACS 151",
      slug: "discrete-structure",
      title: "Discrete Structure",
      credits: "3",
      overview: "Logic, graphs, relations, and combinatorics.",
      units: [
        {
          slug: "set-theory",
          title: "Set Theory and Logic",
          summary: "Proofs, sets, relations, and functions.",
          notes: {
            pdf: [{ title: "Discrete PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/discrete-structure/set-theory/set-theory.pdf", format: "pdf" }],
            handwritten: [{ title: "Discrete Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/discrete-structure/set-theory/set-theory-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "graph-theory",
          title: "Graph Theory",
          summary: "Paths, trees, spanning trees, and graph coloring.",
          notes: {
            pdf: [{ title: "Graph Theory PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/discrete-structure/graph-theory/graph-theory.pdf", format: "pdf" }],
            handwritten: [{ title: "Graph Theory Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/discrete-structure/graph-theory/graph-theory-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
    {
      code: "CACS 152",
      slug: "microprocessor-architecture",
      title: "Microprocessor & Architecture",
      credits: "3",
      overview: "8085 architecture, ALP, timing, memory, and interrupts.",
      units: [
        {
          slug: "8085-basics",
          title: "8085 Basics",
          summary: "Registers, buses, timing, and instruction cycle.",
          notes: {
            pdf: [{ title: "Microprocessor PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/microprocessor-architecture/8085-basics/8085-basics.pdf", format: "pdf" }],
            handwritten: [{ title: "Microprocessor Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/microprocessor-architecture/8085-basics/8085-basics-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "interfacing",
          title: "Memory and I/O Interfacing",
          summary: "Decoding, memory mapping, and system interfaces.",
          notes: {
            pdf: [{ title: "Interfacing PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/microprocessor-architecture/interfacing/interfacing.pdf", format: "pdf" }],
            handwritten: [{ title: "Interfacing Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/microprocessor-architecture/interfacing/interfacing-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
    {
      code: "CACS 153",
      slug: "oop-in-java",
      title: "OOP in Java",
      credits: "3",
      overview: "Classes, inheritance, exceptions, multithreading, and file handling.",
      units: [
        {
          slug: "java-basics",
          title: "Java Basics and OOP",
          summary: "Objects, classes, inheritance, and polymorphism.",
          notes: {
            pdf: [{ title: "Java PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/oop-in-java/java-basics/java-basics.pdf", format: "pdf" }],
            handwritten: [{ title: "Java Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/oop-in-java/java-basics/java-basics-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "exceptions-threading",
          title: "Exceptions and Threading",
          summary: "Try-catch, concurrency, and thread management.",
          notes: {
            pdf: [{ title: "Exceptions PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/oop-in-java/exceptions-threading/exceptions-threading.pdf", format: "pdf" }],
            handwritten: [{ title: "Exceptions Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/oop-in-java/exceptions-threading/exceptions-threading-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
    {
      code: "CAMT 154",
      slug: "mathematics-ii",
      title: "Mathematics II",
      credits: "3",
      overview: "Matrices, vectors, linear algebra, and differential equations.",
      units: [
        {
          slug: "matrix-theory",
          title: "Matrix Theory",
          summary: "Rank, determinants, inverse, and eigen basics.",
          notes: {
            pdf: [{ title: "Math II PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/mathematics-ii/matrix-theory/matrix-theory.pdf", format: "pdf" }],
            handwritten: [{ title: "Math II Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/mathematics-ii/matrix-theory/matrix-theory-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "multivariable-calculus",
          title: "Multivariable Calculus",
          summary: "Partial derivatives, maxima/minima, and optimization.",
          notes: {
            pdf: [{ title: "Multivariable Calculus PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/mathematics-ii/multivariable-calculus/multivariable-calculus.pdf", format: "pdf" }],
            handwritten: [{ title: "Multivariable Calculus Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/mathematics-ii/multivariable-calculus/multivariable-calculus-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
    {
      code: "CACS 155",
      slug: "ux-ui-design",
      title: "UX/UI Design",
      credits: "3",
      overview: "User research, wireframes, layout, contrast, and prototypes.",
      units: [
        {
          slug: "design-process",
          title: "Design Process",
          summary: "Research, personas, journeys, and requirements.",
          notes: {
            pdf: [{ title: "UX Design PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/ux-ui-design/design-process/design-process.pdf", format: "pdf" }],
            handwritten: [{ title: "UX Design Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/ux-ui-design/design-process/design-process-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "visual-design",
          title: "Visual Design",
          summary: "Typography, grids, color systems, and responsive composition.",
          notes: {
            pdf: [{ title: "Visual Design PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/ux-ui-design/visual-design/visual-design.pdf", format: "pdf" }],
            handwritten: [{ title: "Visual Design Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-2/ux-ui-design/visual-design/visual-design-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
  ],
};