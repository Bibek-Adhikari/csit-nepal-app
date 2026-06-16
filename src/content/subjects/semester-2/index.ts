import type { Semester } from "../types";

export const semester2: Semester = {
  key: "semester-2",
  label: "Semester 2",
  overview: "Discrete structures, architecture, Java, mathematics, UX, and management.",
  subjects: [
    {
      code: "BCA 151",
      slug: "discrete-structure",
      title: "Discrete Structure",
      credits: "3",
      overview: "Set theory, logic, induction, graph theory, algebraic structures, and automata.",
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
        {
          slug: "mathematical-induction-recursion",
          title: "Mathematical Induction and Recursion",
          summary: "Principle of induction, strong induction, recursive definitions, recursive algorithms, and structural induction.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "counting-discrete-probability",
          title: "Counting and Discrete Probability",
          summary: "Counting rules, pigeonhole principle, permutations, combinations, binomial theorem, probability, and random variables.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "algebraic-structures",
          title: "Algebraic Structures",
          summary: "Groups, subgroups, cosets, Lagrange's theorem, rings, fields, Boolean algebra, and lattices.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "finite-state-machines-automata",
          title: "Finite State Machines and Automata",
          summary: "DFA, NFA, regular expressions, context-free grammars, pushdown automata, and Turing machines.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "BCA 152",
      slug: "microprocessor-architecture",
      title: "Microprocessor and Computer Architecture",
      credits: "3",
      overview: "Computer architecture, digital logic, 8085/8086 microprocessor, memory interfacing, and assembly programming.",
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
        {
          slug: "intro-computer-architecture",
          title: "Introduction to Computer Architecture",
          summary: "Von Neumann and Harvard architectures, CPU components, bus systems, and performance metrics.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "digital-logic-building-blocks",
          title: "Digital Logic and Building Blocks",
          summary: "Logic gates, combinational and sequential circuits, ALU design, decoders, multiplexers, and memory organization.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "advanced-processor-architectures",
          title: "Advanced Processor Architectures",
          summary: "Pipelining, RISC vs CISC, superscalar processors, multi-core, and GPU architecture.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "assembly-language-programming",
          title: "Assembly Language Programming",
          summary: "Assembly syntax, data transfer, arithmetic, loops, subroutines, stack operations, and interrupt handling.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "BCA 153",
      slug: "oop-in-java",
      title: "OOP in Java",
      credits: "3",
      overview: "OOP principles, classes, inheritance, polymorphism, exceptions, I/O, collections, and GUI programming.",
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
        {
          slug: "classes-objects",
          title: "Classes and Objects",
          summary: "Class definition, constructors, static members, access modifiers, packages, nested classes, and garbage collection.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "inheritance-polymorphism",
          title: "Inheritance and Polymorphism",
          summary: "Single/multilevel/hierarchical inheritance, method overriding, abstract classes, interfaces, and dynamic dispatch.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "java-io-collections",
          title: "Java I/O and Collections",
          summary: "Byte/character streams, file handling, serialization, Collections Framework (List, Set, Map, Queue), and iterators.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "gui-programming",
          title: "GUI Programming and Event Handling",
          summary: "AWT and Swing components, layout managers, event handling with listeners, and introduction to JavaFX.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "BCA 154",
      slug: "mathematics-ii",
      title: "Mathematics II",
      credits: "3",
      overview: "Differential calculus, integral calculus, differential equations, numerical methods, Fourier series, and probability.",
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
        {
          slug: "differential-calculus",
          title: "Differential Calculus",
          summary: "Limits, continuity, differentiation rules, implicit differentiation, maxima/minima, mean value theorem, and series.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "differential-equations",
          title: "Differential Equations",
          summary: "First and second order ODEs, variable separable, homogeneous, exact equations, and applications.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "numerical-methods",
          title: "Numerical Methods",
          summary: "Bisection, Newton-Raphson, interpolation, numerical differentiation, integration, and linear system solutions.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "fourier-series-transforms",
          title: "Fourier Series and Transforms",
          summary: "Periodic functions, Fourier series for even/odd functions, half-range series, and Fourier transforms.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "probability-statistics",
          title: "Probability and Statistics",
          summary: "Random variables, binomial/Poisson/normal distributions, correlation, regression, and hypothesis testing.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "BCA 155",
      slug: "ux-ui-design",
      title: "UX/UI Design",
      credits: "3",
      overview: "UX research, wireframing, prototyping, visual design, interaction design, and usability testing.",
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
        {
          slug: "user-research-analysis",
          title: "User Research and Analysis",
          summary: "Research methods, personas, user journeys, empathy mapping, competitive analysis, and information architecture.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "wireframing-prototyping",
          title: "Wireframing and Prototyping",
          summary: "Low and high-fidelity wireframes, interactive prototyping, responsive design, and design systems.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "interaction-design",
          title: "Interaction Design",
          summary: "Interaction principles, micro-interactions, feedback, gestural interfaces, VUI, and state management.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "usability-testing",
          title: "Usability Testing and Design Evaluation",
          summary: "Usability testing methods, A/B testing, heuristic evaluation, accessibility testing, and iterative design.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "BCA 156",
      slug: "principles-of-management",
      title: "Principles of Management",
      credits: "1",
      overview: "Management functions, planning, organizing, staffing, directing, controlling, and entrepreneurship.",
      units: [
        {
          slug: "intro-management",
          title: "Introduction to Management",
          summary: "Definition, functions, levels, skills, evolution of management thought, and classical/behavioral/modern approaches.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "planning-organizing",
          title: "Planning and Organizing",
          summary: "Planning process, decision making, organizational structure, delegation, centralization, and organizational culture.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "staffing-directing",
          title: "Staffing and Directing",
          summary: "Recruitment, selection, training, motivation theories, leadership styles, communication, and team building.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "controlling-contemporary-issues",
          title: "Controlling and Contemporary Issues",
          summary: "Control process, quality management, TQM, Six Sigma, project management, and digital transformation.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "entrepreneurship-innovation",
          title: "Entrepreneurship and Innovation",
          summary: "Entrepreneurship concepts, startup ecosystem, business models, innovation, risk management, and case studies.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
  ],
};