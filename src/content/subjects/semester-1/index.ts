import type { Semester } from "../types";

export const semester1: Semester = {
  key: "semester-1",
  label: "Semester 1",
  overview: "Foundation subjects for logic, computation, communication, and TU basic mathematics.",
  subjects: [
    {
      code: "CACS 101",
      slug: "programming-in-c",
      title: "Programming in C",
      credits: "4",
      overview: "Control flow, functions, arrays, pointers, strings, and file handling.",
      units: [
        {
          slug: "c-basics",
          title: "C Basics and Problem Solving",
          summary: "Tokens, data types, operators, I/O, and algorithmic thinking.",
          notes: {
            pdf: [
              { title: "Unit 1 PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/c-basics/c-basics.pdf", format: "pdf" },
            ],
            handwritten: [
              { title: "Unit 1 Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/c-basics/c-basics-handwritten.pdf", format: "handwritten" },
            ],
          },
        },
        {
          slug: "control-and-loops",
          title: "Control Structures and Loops",
          summary: "Branching, iteration, nested loops, and runtime tracing.",
          notes: {
            pdf: [
              { title: "Unit 2 PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/control-and-loops/control-and-loops.pdf", format: "pdf" },
            ],
            handwritten: [
              { title: "Unit 2 Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/control-and-loops/control-and-loops-handwritten.pdf", format: "handwritten" },
            ],
          },
        },
        {
          slug: "functions-pointers-files",
          title: "Functions, Pointers, and Files",
          summary: "Modularity, memory addresses, structures, and file operations.",
          notes: {
            pdf: [
              { title: "Unit 3 PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/functions-pointers-files/functions-pointers-files.pdf", format: "pdf" },
            ],
            handwritten: [
              { title: "Unit 3 Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/functions-pointers-files/functions-pointers-files-handwritten.pdf", format: "handwritten" },
            ],
          },
        },
      ],
    },
    {
      code: "CACS 102",
      slug: "digital-logic",
      title: "Digital Logic",
      credits: "3",
      overview: "Binary systems, boolean algebra, minimization, and sequential circuits.",
      units: [
        {
          slug: "number-system",
          title: "Number System and Boolean Algebra",
          summary: "Conversions, truth tables, and canonical forms.",
          notes: {
            pdf: [{ title: "Digital Logic PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/number-system/number-system.pdf", format: "pdf" }],
            handwritten: [{ title: "Digital Logic Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/number-system/number-system-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "combinational-circuits",
          title: "Combinational Circuits",
          summary: "Gates, adders, multiplexers, and decoders.",
          notes: {
            pdf: [{ title: "Combinational Circuits PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/combinational-circuits/combinational-circuits.pdf", format: "pdf" }],
            handwritten: [{ title: "Combinational Circuits Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/combinational-circuits/combinational-circuits-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "sequential-circuits",
          title: "Sequential Circuits",
          summary: "Flip-flops, counters, registers, and state machines.",
          notes: {
            pdf: [{ title: "Sequential Circuits PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/sequential-circuits/sequential-circuits.pdf", format: "pdf" }],
            handwritten: [{ title: "Sequential Circuits Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/sequential-circuits/sequential-circuits-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
    {
      code: "CAMT 103",
      slug: "mathematics-i",
      title: "Mathematics I",
      credits: "3",
      overview: "Sets, functions, limits, derivatives, integrals, and vectors.",
      units: [
        {
          slug: "calculus-foundations",
          title: "Calculus Foundations",
          summary: "Limits, continuity, derivatives, and applications.",
          notes: {
            pdf: [{ title: "Math I PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/calculus-foundations/calculus-foundations.pdf", format: "pdf" }],
            handwritten: [{ title: "Math I Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/calculus-foundations/calculus-foundations-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "integration-and-vectors",
          title: "Integration and Vectors",
          summary: "Definite integrals, vectors, and 3D geometry.",
          notes: {
            pdf: [{ title: "Integration PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/integration-and-vectors/integration-and-vectors.pdf", format: "pdf" }],
            handwritten: [{ title: "Integration Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/integration-and-vectors/integration-and-vectors-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
    {
      code: "CACS 104",
      slug: "society-and-technology",
      title: "Society & Technology",
      credits: "3",
      overview: "Technology history, cyber law, socio-economic changes, and sustainability.",
      units: [
        {
          slug: "technology-society",
          title: "Technology and Society",
          summary: "Tech evolution, digital economy, and cultural change.",
          notes: {
            pdf: [{ title: "Society & Tech PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/society-and-technology/technology-society/technology-society.pdf", format: "pdf" }],
            handwritten: [{ title: "Society & Tech Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/society-and-technology/technology-society/technology-society-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "cyber-law",
          title: "Cyber Law and Ethics",
          summary: "Electronic transactions, privacy, and digital safety.",
          notes: {
            pdf: [{ title: "Cyber Law PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/society-and-technology/cyber-law/cyber-law.pdf", format: "pdf" }],
            handwritten: [{ title: "Cyber Law Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/society-and-technology/cyber-law/cyber-law-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
    {
      code: "CAEN 105",
      slug: "professional-communication",
      title: "Professional Communication",
      credits: "3",
      overview: "Technical writing, presentations, and professional interaction.",
      units: [
        {
          slug: "reading-writing",
          title: "Reading and Writing Skills",
          summary: "Summaries, reports, and professional emails.",
          notes: {
            pdf: [{ title: "Communication PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication/reading-writing/reading-writing.pdf", format: "pdf" }],
            handwritten: [{ title: "Communication Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication/reading-writing/reading-writing-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "presentation-skills",
          title: "Presentation Skills",
          summary: "Visual delivery, non-verbal communication, and speaking structure.",
          notes: {
            pdf: [{ title: "Presentation PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication/presentation-skills/presentation-skills.pdf", format: "pdf" }],
            handwritten: [{ title: "Presentation Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication/presentation-skills/presentation-skills-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
  ],
};