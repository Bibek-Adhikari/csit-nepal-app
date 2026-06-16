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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/computer-fundamentals-and-applications/intro-computer/c-basics.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/computer-fundamentals-and-applications/intro-computer/c-basics-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/computer-fundamentals-and-applications/hardware-software/control-and-loops.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/computer-fundamentals-and-applications/hardware-software/control-and-loops-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/computer-fundamentals-and-applications/dbms-networks-security/functions-pointers-files.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/computer-fundamentals-and-applications/dbms-networks-security/functions-pointers-files-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "computer-software",
          title: "Computer Software",
          summary: "Introduction to software types, operating systems, utilities, programming languages, and translators.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "computer-network-internet",
          title: "Computer Network and Internet",
          summary: "Network types, LAN topologies, transmission media, OSI model, protocols, DNS, and client-server concepts.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "computer-security",
          title: "Computer Security",
          summary: "Security threats, malicious software, cryptography, digital signatures, firewalls, and intrusion detection.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "contemporary-technology",
          title: "Contemporary Technology",
          summary: "AI, machine learning, blockchain, IoT, cloud computing, and virtual/augmented reality.",
          notes: { pdf: [], handwritten: [] },
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/intro-c-basics/number-system.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/intro-c-basics/number-system-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/control-loops/combinational-circuits.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/control-loops/combinational-circuits-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/functions-arrays-pointers/sequential-circuits.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/functions-arrays-pointers/sequential-circuits-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "structures-unions-enumerations",
          title: "Structures, Unions, and Enumerations",
          summary: "Defining and accessing structures, unions, nested structures, arrays of structures, enums, and typedef.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "pointers-memory-management",
          title: "Pointers and Memory Management",
          summary: "Pointer declaration, arithmetic, pointers with arrays/strings/functions/structures, dynamic memory allocation.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "file-handling-command-line-graphics",
          title: "File Handling, Command-Line Arguments, and Graphics",
          summary: "File operations, random access, error handling, command-line arguments, and graphics programming in C.",
          notes: { pdf: [], handwritten: [] },
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/number-systems/calculus-foundations.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/number-systems/calculus-foundations-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/boolean-simplification/integration-and-vectors.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/boolean-simplification/integration-and-vectors-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/combinational-sequential/technology-society.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/digital-logic/combinational-sequential/technology-society-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "sequential-logic-design",
          title: "Sequential Logic Design",
          summary: "State diagrams, state reduction, triggering, latches, and flip-flops (RS, D, T, JK, Master-Slave).",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "counters-registers",
          title: "Counters and Registers",
          summary: "Asynchronous and synchronous counters, ring counters, modulus counters, and shift registers.",
          notes: { pdf: [], handwritten: [] },
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/logic-relations/technology-society.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/logic-relations/technology-society-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/sequences-series/integration-and-vectors.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/sequences-series/integration-and-vectors-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/matrices-geometry/matrix-theory.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/mathematics-i/matrices-geometry/matrix-theory-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "analytical-geometry",
          title: "Analytical Geometry",
          summary: "Conic sections, standard equations of circle, parabola, ellipse, hyperbola, and polar equations.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "vector-vector-space",
          title: "Vector and Vector Space",
          summary: "Vector operations, scalar and vector products, vector space, subspace, linear dependence and independence.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "permutations-combinations",
          title: "Permutations and Combinations",
          summary: "Counting principles, permutations of n objects, circular permutations, combinations and their properties.",
          notes: { pdf: [], handwritten: [] },
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication-and-ethics/communication-foundations/reading-writing.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication-and-ethics/communication-foundations/reading-writing-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "writing-professionally",
          title: "Writing Professionally",
          summary: "Professional writing rules, emails, memos, notices, letters, résumés, and cover letters.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "interpersonal-group-communication",
          title: "Interpersonal and Group Communication",
          summary: "Workplace communication, listening, intercultural communication, teamwork, and leadership.",
          notes: { pdf: [], handwritten: [] },
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication-and-ethics/oral-and-writing/presentation-skills.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication-and-ethics/oral-and-writing/presentation-skills-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication-and-ethics/ethics-digital-communication/cyber-law.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 3 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/professional-communication-and-ethics/ethics-digital-communication/cyber-law-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/hardware-workshop/electronics-basics/c-basics.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 1 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/hardware-workshop/electronics-basics/c-basics-handwritten.pdf",
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
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/hardware-workshop/networking-components/technology-society.pdf",
                format: "pdf",
              },
            ],
            handwritten: [
              {
                title: "Unit 2 Handwritten Notes",
                href:
                  "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/hardware-workshop/networking-components/technology-society-handwritten.pdf",
                format: "handwritten",
              },
            ],
          },
        },
        {
          slug: "desktop-laptop-hardware",
          title: "Desktop and Laptop Hardware Identification and Handling",
          summary: "PC hardware identification, workbench safety, system unit components, storage devices, I/O devices, and PSU testing.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
  ],
};

