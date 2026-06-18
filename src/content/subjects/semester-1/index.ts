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
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "computer-hardware",
          title: "Computer Hardware",
          summary: "Organization, CPU components, memory hierarchy, input/output devices, and storage.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "computer-software",
          title: "Computer Software",
          summary: "Introduction to software types, operating systems, utilities, programming languages, and translators.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "database-management-system",
          title: "Database Management System",
          summary: "DBMS concepts, data models, SQL/NoSQL, database design, normalization, and transaction management.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "computer-network-internet",
          title: "Computer Network and Internet",
          summary: "Network types, topologies, transmission media, OSI model, protocols, DNS, and client-server concepts.",
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
      title: "Programming Fundamentals using C",
      credits: "3",
      overview:
        "Core C programming fundamentals: control structures, functions, arrays, pointers, and file handling.",
      units: [
        {
          slug: "intro-c-basics",
          title: "Introduction to C Programming Language and Basics",
          summary: "Tokens, data types, operators, compilation and execution, I/O basics.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "io-control-structures",
          title: "Input/Output and Control Structures",
          summary: "Decision making, loops, nested loops, and jump statements.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "functions-arrays-string",
          title: "Functions, Arrays and String",
          summary: "Functions, arrays, strings, pointers, recursion, and related concepts.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "structures-unions-enumerations",
          title: "Structures, Unions, and Enumerations",
          summary: "Defining and accessing structures, unions, nested structures, arrays of structures, enums, and typedef.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "pointers-memory-management",
          title: "Pointers and Dynamic Memory Allocation",
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
      title: "Digital Logic Design",
      credits: "3",
      overview:
        "Digital design fundamentals: number systems, boolean algebra, combinational and sequential logic.",
      units: [
        {
          slug: "number-system-digital-logic",
          title: "Number System and Digital Logic",
          summary: "Conversions, signed numbers, complements, BCD/ASCII/Gray code, error detection, logic gates.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "boolean-simplification",
          title: "Boolean Algebra and its Simplification",
          summary: "Gates, universal logic, SOP/POS, K-map, Quine-McCluskey.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "combinational-logic-design",
          title: "Combinational Logic Design",
          summary: "Adders/subtractors, multiplexers, decoders, encoders, comparators, and ALU design.",
          notes: { pdf: [], handwritten: [] },
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
      title: "Mathematics I",
      credits: "3",
      overview:
        "Mathematical foundations: logic/relations, sequences/series, matrices/determinants, analytical geometry, vectors and permutations.",
      units: [
        {
          slug: "logic-relations-functions-graphs",
          title: "Logic, Relations, Functions, and Graphs",
          summary: "Elementary logic, ordered axioms, relations and functions, graphs.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "sequence-series",
          title: "Sequence and Series",
          summary: "Arithmetic/geometric/harmonic series, means, sums.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "matrices-determinants",
          title: "Matrices and Determinants",
          summary: "Matrices, determinants, properties, inverse, rank, and system of linear equations.",
          notes: { pdf: [], handwritten: [] },
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
          slug: "foundation-professional-communication",
          title: "Foundation of Professional Communication",
          summary: "Language, communication process, nonverbal communication, barriers.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "oral-communication",
          title: "Oral Communication",
          summary: "Telephone conversations, public speaking, presentations, and interview techniques.",
          notes: { pdf: [], handwritten: [] },
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
          slug: "digital-communication",
          title: "Digital Communication",
          summary: "Netiquette, online professionalism, digital tools, and virtual collaboration.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "professional-ethics",
          title: "Professional Ethics",
          summary: "Professional ethics, plagiarism, intellectual property, and ethical decision making.",
          notes: { pdf: [], handwritten: [] },
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
          slug: "intro-hardware-electronic-components",
          title: "Introduction to Hardware (Electronic Components)",
          summary: "Electronic components, safety, passive/active components and datasheets.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "intro-networking-components",
          title: "Introduction to Networking Components",
          summary: "Network devices, cabling and connectors, testing and troubleshooting.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "desktop-laptop-hardware-id",
          title: "Desktop and Laptop Hardware Identification and Handling",
          summary: "PC hardware identification, workbench safety, system unit components, storage devices, I/O devices, and PSU testing.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "pc-laptop-assembly",
          title: "PC and Laptop Assembly",
          summary: "Assembly and disassembly of desktop and laptop systems, component installation, and cable management.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "basic-network-device-deployment",
          title: "Basic Network Device and Deployment",
          summary: "Network device installation, router and switch configuration, and small network setup.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "basic-networking-configuration",
          title: "Basic Networking Configuration",
          summary: "IP addressing, subnetting, DHCP, DNS configuration, and network troubleshooting.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "problem-solving-techniques",
          title: "Problem Solving Techniques",
          summary: "Diagnostic methods, troubleshooting methodology, hardware and software issue resolution.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "maintenance-upgrade",
          title: "Maintenance and Upgrade",
          summary: "Preventive maintenance, system upgrades, driver updates, and performance optimization.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "final-practical-assessment",
          title: "Final Practical Assessment",
          summary: "Comprehensive practical evaluation covering hardware assembly, networking, and troubleshooting.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
  ],
};
