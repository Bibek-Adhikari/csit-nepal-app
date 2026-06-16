import type { Semester } from "../types";

export const semester1: Semester = {
  key: "semester-1",
  label: "Semester 1",
  overview: "Foundation subjects for logic, computation, communication, and basic mathematics.",
  subjects: [
    {
      code: "BCA 101",
      slug: "computer-fundamentals-and-applications",
      title: "Computer Fundamentals and Applications",
      credits: "3",
      overview:
        "Fundamentals and practical application of computers, hardware, software, databases, networks, security, and contemporary technologies.",
      units: [
        {
          slug: "intro-computer",
          title: "Introduction to Computer",
          summary: "Definition, characteristics, anatomy, types, history, and applications.",
          notes: {
            pdf: [
              {
                title: "Unit 1 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/c-basics.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/c-basics-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "hardware-software",
          title: "Computer Hardware & Software",
          summary: "Organization, CPU components, memory hierarchy, OS and utilities, translators.",
          notes: {
            pdf: [
              {
                title: "Unit 2 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/control-and-loops.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/control-and-loops-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "dbms-networks-security",
          title: "DBMS, Networks & Security",
          summary: "DBMS concepts, SQL/NoSQL ideas, network & OSI model basics, security mechanisms.",
          notes: {
            pdf: [
              {
                title: "Unit 3 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/functions-pointers-files.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/functions-pointers-files-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
      ],
    },
    {
      code: "BCA 102",
      slug: "programming-in-c",
      title: "Programming in C",
      credits: "3",
      overview:
        "Core C programming fundamentals: control structures, functions, arrays, pointers, and file handling.",
      units: [
        {
          slug: "intro-c-basics",
          title: "C Basics and Program Structure",
          summary: "Tokens, data types, operators, compilation and execution, I/O basics.",
          notes: {
            pdf: [
              {
                title: "Unit 1 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/number-system.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/number-system-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "control-loops",
          title: "Control Structures & Loops",
          summary: "Decision making, loops, nested loops, and jump statements.",
          notes: {
            pdf: [
              {
                title: "Unit 2 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/combinational-circuits.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/combinational-circuits-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "functions-arrays-pointers",
          title: "Functions, Arrays & Pointers",
          summary: "Functions, arrays, strings, pointers, recursion, and related concepts.",
          notes: {
            pdf: [
              {
                title: "Unit 3 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/sequential-circuits.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/sequential-circuits-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
      ],
    },
    {
      code: "BCA 103",
      slug: "digital-logic",
      title: "Digital Logic",
      credits: "3",
      overview:
        "Digital design fundamentals: number systems, boolean algebra, combinational and sequential logic.",
      units: [
        {
          slug: "number-systems",
          title: "Number Systems & Representations",
          summary: "Conversions, signed numbers, complements, BCD/ASCII/Gray code, error detection.",
          notes: {
            pdf: [
              {
                title: "Unit 1 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/calculus-foundations.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/calculus-foundations-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "boolean-simplification",
          title: "Boolean Algebra & Simplification",
          summary: "Gates, universal logic, SOP/POS, K-map, Quine-McCluskey.",
          notes: {
            pdf: [
              {
                title: "Unit 2 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/integration-and-vectors.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/integration-and-vectors-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "combinational-sequential",
          title: "Combinational & Sequential Logic",
          summary: "Adders/subtractors, multiplexers, state diagrams, latches/flip-flops, counters/registers.",
          notes: {
            pdf: [
              {
                title: "Unit 3 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/technology-society.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/technology-society-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
      ],
    },
    {
      code: "BCA 104",
      slug: "mathematics-i",
      title: "Mathematics-I",
      credits: "3",
      overview:
        "Mathematical foundations: logic/relations, sequences/series, matrices/determinants, analytical geometry, vectors and permutations.",
      units: [
        {
          slug: "logic-relations",
          title: "Logic, Relations & Functions",
          summary: "Elementary logic, ordered axioms, relations and functions, graphs.",
          notes: {
            pdf: [
              {
                title: "Unit 1 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/technology-society.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/technology-society-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "sequences-series",
          title: "Sequence & Series",
          summary: "Arithmetic/geometric/harmonic series, means, sums.",
          notes: {
            pdf: [
              {
                title: "Unit 2 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/integration-and-vectors.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/integration-and-vectors-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "matrices-geometry",
          title: "Matrices, Determinants & Geometry",
          summary: "Matrices, determinants, analytical geometry, vectors and permutations.",
          notes: {
            pdf: [
              {
                title: "Unit 3 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/matrix-theory.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/matrix-theory-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
      ],
    },
    {
      code: "BCA 105",
      slug: "professional-communication-and-ethics",
      title: "Professional Communication and Ethics",
      credits: "3",
      overview:
        "Professional communication skills and ethics in computing and workplace contexts.",
      units: [
        {
          slug: "communication-foundations",
          title: "Communication Foundations",
          summary: "Language, communication process, nonverbal communication, barriers.",
          notes: {
            pdf: [
              {
                title: "Unit 1 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/reading-writing.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/reading-writing-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "oral-and-writing",
          title: "Oral & Written Communication",
          summary: "Telephone conversations, public speaking, notices, emails and letters.",
          notes: {
            pdf: [
              {
                title: "Unit 2 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/presentation-skills.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/presentation-skills-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "ethics-digital-communication",
          title: "Ethics & Digital Communication",
          summary: "Professional ethics, netiquette, online professionalism, plagiarism.",
          notes: {
            pdf: [
              {
                title: "Unit 3 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/cyber-law.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/cyber-law-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
      ],
    },
    {
      code: "BCA 106",
      slug: "hardware-workshop",
      title: "Hardware Workshop",
      credits: "1",
      overview: "Practical workshop covering electronic components, networking components and PC hardware handling.",
      units: [
        {
          slug: "electronics-basics",
          title: "Introduction to Hardware",
          summary: "Electronic components, safety, passive/active components and datasheets.",
          notes: {
            pdf: [
              {
                title: "Unit 1 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/c-basics.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/c-basics-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "networking-components",
          title: "Networking Components",
          summary: "Network devices, cabling & connectors, testing/troubleshooting.",
          notes: {
            pdf: [
              {
                title: "Unit 2 PDF Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/technology-society.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/technology-society-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
      ],
    },
  ],
};

