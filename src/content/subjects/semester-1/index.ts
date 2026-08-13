import type { Semester } from "../types";

export const semester1: Semester = {
  key: "semester-1",
  label: "Semester 1",
  overview: "Foundation subjects covering computers, C programming, digital logic, mathematics, and physics.",
  subjects: [
    {
      code: "CSC114",
      slug: "introduction-to-information-technology",
      title: "Introduction to Information Technology",
      credits: "3",
      overview:
        "Fundamentals of computers, number systems, software, operating systems, databases, networks, and web technologies.",
      units: [
        {
          slug: "introduction-to-computer-system",
          title: "Introduction to Computer System",
          summary: "Definition, characteristics, components, types, history, and applications of computers.",
          topics: [
            { title: "Computer Fundamentals", subTopics: ["Definition and characteristics", "Generations of computers", "Types and classification"] },
            { title: "System Anatomy", subTopics: ["CPU and its components", "Memory hierarchy", "Input/output devices"] },
            { title: "Applications", subTopics: ["Business and education", "Science and engineering", "Everyday computing"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "number-systems-and-boolean-algebra",
          title: "Number Systems and Boolean Algebra",
          summary: "Binary, octal, hexadecimal systems, conversions, complements, and basic Boolean logic.",
          topics: [
            { title: "Number Systems", subTopics: ["Binary, octal, hexadecimal", "Conversions between bases", "Arithmetic operations"] },
            { title: "Complements and Codes", subTopics: ["1's and 2's complements", "BCD and ASCII codes", "Error detection basics"] },
            { title: "Boolean Algebra", subTopics: ["Boolean operations and laws", "Logic expressions", "Truth tables"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "computer-software",
          title: "Computer Software",
          summary: "System and application software, programming languages, translators, and utilities.",
          topics: [
            { title: "Software Types", subTopics: ["System software", "Application software", "Utility programs"] },
            { title: "Programming Languages", subTopics: ["Low and high level languages", "Compilers and interpreters", "Assemblers"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "operating-systems",
          title: "Operating Systems",
          summary: "Functions of operating systems, process and memory management, file systems, and common OS families.",
          topics: [
            { title: "OS Concepts", subTopics: ["Functions and services", "Process and memory management", "File and device management"] },
            { title: "OS Families", subTopics: ["Windows, Linux, macOS", "Mobile operating systems", "Real-time and embedded OS"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "database-management-systems",
          title: "Database Management Systems",
          summary: "Database concepts, data models, relational design, SQL, and database applications.",
          topics: [
            { title: "Database Fundamentals", subTopics: ["Data vs information", "DBMS architecture", "Data models"] },
            { title: "Relational Databases", subTopics: ["Tables, keys, relationships", "Normalization basics", "SQL essentials"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "data-communication-and-networks",
          title: "Data Communication and Computer Networks",
          summary: "Communication basics, network types, topologies, the OSI model, and TCP/IP protocols.",
          topics: [
            { title: "Communication Basics", subTopics: ["Data transmission modes", "Transmission media", "Bandwidth and multiplexing"] },
            { title: "Networking", subTopics: ["LAN, MAN, WAN", "Network topologies", "OSI reference model"] },
            { title: "Internet Protocols", subTopics: ["TCP/IP stack", "IP addressing", "DNS and web services"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "internet-and-world-wide-web",
          title: "Internet and World Wide Web",
          summary: "Internet services, WWW, browsers, HTML, search engines, and web applications.",
          topics: [
            { title: "Internet Services", subTopics: ["E-mail and messaging", "File transfer and remote access", "E-commerce and e-government"] },
            { title: "Web Technologies", subTopics: ["Structure of a web page", "HTML and CSS basics", "Web browsers and search engines"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "application-software-packages",
          title: "Application Software Packages",
          summary: "Word processing, spreadsheets, presentations, and other productivity tools.",
          topics: [
            { title: "Productivity Tools", subTopics: ["Word processors", "Spreadsheets", "Presentation software"] },
            { title: "Specialized Applications", subTopics: ["Graphics and multimedia", "Educational software", "Emerging application trends"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [],
    },
    {
      code: "CSC115",
      slug: "c-programming",
      title: "C Programming",
      credits: "3",
      overview:
        "Core C programming: data types, control structures, functions, arrays, pointers, structures, and file handling.",
      units: [
        {
          slug: "introduction-to-c",
          title: "Introduction to C Programming",
          summary: "History of C, structure of a C program, compilation and execution, tokens, and basic syntax.",
          topics: [
            { title: "Getting Started", subTopics: ["History and features of C", "Structure of a C program", "Compilation and execution process"] },
            { title: "Language Elements", subTopics: ["Identifiers and keywords", "Constants and variables", "Preprocessor directives"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "data-types-operators-expressions",
          title: "Data Types, Operators and Expressions",
          summary: "Primitive data types, type modifiers, operators, expressions, and type conversions.",
          topics: [
            { title: "Data Types", subTopics: ["int, float, double, char", "Type modifiers and sizes", "Type conversion and casting"] },
            { title: "Operators", subTopics: ["Arithmetic and relational", "Logical and bitwise", "Assignment and conditional"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "input-output-and-control-statements",
          title: "Input/Output and Control Statements",
          summary: "Formatted I/O, decision making, loops, and jump statements.",
          topics: [
            { title: "Input/Output", subTopics: ["printf and scanf", "getchar, putchar, gets, puts", "Formatted vs unformatted I/O"] },
            { title: "Decision Making", subTopics: ["if, if-else, else-if", "switch statement", "Nesting and pitfalls"] },
            { title: "Loops", subTopics: ["for, while, do-while", "Nested loops", "break and continue"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "arrays-and-strings",
          title: "Arrays and Strings",
          summary: "One and multi-dimensional arrays, string handling functions, and array applications.",
          topics: [
            { title: "Arrays", subTopics: ["One-dimensional arrays", "Multi-dimensional arrays", "Array operations and bounds"] },
            { title: "Strings", subTopics: ["Character arrays", "String library functions", "String manipulation programs"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "functions",
          title: "Functions",
          summary: "Function declaration and definition, parameter passing, recursion, and storage classes.",
          topics: [
            { title: "Function Basics", subTopics: ["Declaration and definition", "Call by value", "Call by reference"] },
            { title: "Advanced Functions", subTopics: ["Recursion", "Storage classes", "Function pointers"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "structures-and-unions",
          title: "Structures and Unions",
          summary: "Defining structures, arrays of structures, nested structures, unions, and typedef.",
          topics: [
            { title: "Structures", subTopics: ["Structure definition and access", "Arrays of structures", "Nested and pointer structures"] },
            { title: "Unions and Enums", subTopics: ["Unions vs structures", "Enumeration types", "typedef usage"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "pointers",
          title: "Pointers",
          summary: "Pointer declaration, pointer arithmetic, pointers with arrays, strings, and dynamic memory allocation.",
          topics: [
            { title: "Pointer Basics", subTopics: ["Declaration and initialization", "Pointer arithmetic", "Pointers and arrays"] },
            { title: "Advanced Pointers", subTopics: ["Pointers and strings", "Pointers to functions", "Dynamic memory allocation"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "file-handling-and-preprocessor",
          title: "File Handling and Preprocessor",
          summary: "File operations, random access, error handling, command-line arguments, and preprocessor directives.",
          topics: [
            { title: "File I/O", subTopics: ["Opening and closing files", "Reading and writing data", "Random access functions"] },
            { title: "Preprocessor", subTopics: ["Macros and headers", "Conditional compilation", "Command-line arguments"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [
        { slug: "lab-1-c-basics", title: "Lab 1: C Basics and I/O", summary: "Programs using data types, operators, and formatted input/output.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-2-control-structures", title: "Lab 2: Control Structures", summary: "Programs using if-else, switch, and loop constructs.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-3-arrays-strings", title: "Lab 3: Arrays and Strings", summary: "Programs performing array and string manipulation.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-4-functions", title: "Lab 4: Functions", summary: "Programs using user-defined functions and recursion.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-5-pointers-files", title: "Lab 5: Pointers and Files", summary: "Programs using pointers, dynamic allocation, and file handling.", notes: { pdf: [], handwritten: [] } },
      ],
    },
    {
      code: "CSC116",
      slug: "digital-logic",
      title: "Digital Logic",
      credits: "3",
      overview:
        "Number systems, Boolean algebra, combinational and sequential circuits, registers, counters, and memory.",
      units: [
        {
          slug: "number-systems-and-codes",
          title: "Number Systems and Codes",
          summary: "Binary, octal, hexadecimal systems, conversions, complements, and binary codes.",
          topics: [
            { title: "Number Representations", subTopics: ["Binary, octal, hexadecimal", "Conversions and arithmetic", "Signed number representations"] },
            { title: "Binary Codes", subTopics: ["BCD and excess-3", "Gray code", "ASCII and parity"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "boolean-algebra-and-logic-gates",
          title: "Boolean Algebra and Logic Gates",
          summary: "Boolean laws and theorems, logic gates, gate-level minimization, and Karnaugh maps.",
          topics: [
            { title: "Boolean Algebra", subTopics: ["Laws and theorems", "SOP and POS forms", "De Morgan's theorem"] },
            { title: "Logic Gates", subTopics: ["AND, OR, NOT, NAND, NOR", "XOR and XNOR", "Universal gates"] },
            { title: "Minimization", subTopics: ["Karnaugh maps", "Don't care conditions", "Two-level implementations"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "combinational-logic-design",
          title: "Combinational Logic Design",
          summary: "Design of adders, subtractors, encoders, decoders, multiplexers, and comparators.",
          topics: [
            { title: "Arithmetic Circuits", subTopics: ["Half and full adders", "Subtractors", "Ripple carry and lookahead"] },
            { title: "MSI Circuits", subTopics: ["Encoders and decoders", "Multiplexers and demultiplexers", "Comparators"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "sequential-logic-design",
          title: "Sequential Logic Design",
          summary: "Latches, flip-flops, state diagrams, counters, and registers.",
          topics: [
            { title: "Flip-Flops", subTopics: ["SR, D, JK, T flip-flops", "Master-slave configuration", "Excitations and characteristic tables"] },
            { title: "Sequential Circuits", subTopics: ["State diagrams", "Design of synchronous circuits", "Analysis of clocked circuits"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "registers-and-counters",
          title: "Registers and Counters",
          summary: "Shift registers, register operations, and synchronous/asynchronous counters.",
          topics: [
            { title: "Registers", subTopics: ["Shift register types", "Serial and parallel data movement", "Ring and Johnson counters"] },
            { title: "Counters", subTopics: ["Synchronous counters", "Asynchronous counters", "Mod-N counter design"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "memory-and-programmable-logic",
          title: "Memory and Programmable Logic",
          summary: "Memory organization, RAM/ROM types, and programmable logic devices.",
          topics: [
            { title: "Memory", subTopics: ["Memory hierarchy", "RAM and ROM types", "Address decoding"] },
            { title: "PLDs", subTopics: ["PROM and PLA", "PAL devices", "Simple programmable logic"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "logic-families-and-interfacing",
          title: "Logic Families and Interfacing",
          summary: "TTL and CMOS families, propagation delays, fan-out, and interfacing considerations.",
          topics: [
            { title: "Logic Families", subTopics: ["TTL characteristics", "CMOS characteristics", "Comparisons and trade-offs"] },
            { title: "Interfacing", subTopics: ["Fan-in and fan-out", "Level shifting", "Noise margins"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [],
    },
    {
      code: "MTH117",
      slug: "mathematics-i",
      title: "Mathematics I",
      credits: "3",
      overview:
        "Set theory, functions, limits, differential and integral calculus, matrices, and sequences and series.",
      units: [
        {
          slug: "set-theory-and-real-number-system",
          title: "Set Theory and Real Number System",
          summary: "Sets, operations on sets, relations, and the properties of real numbers.",
          topics: [
            { title: "Sets", subTopics: ["Set operations", "Venn diagrams", "Cartesian products"] },
            { title: "Real Numbers", subTopics: ["Properties of real numbers", "Inequalities and intervals", "Absolute value"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "functions-limits-and-continuity",
          title: "Functions, Limits and Continuity",
          summary: "Types of functions, limits, algebraic evaluation, and continuity.",
          topics: [
            { title: "Functions", subTopics: ["Types of functions", "Composite and inverse functions", "Graphs of functions"] },
            { title: "Limits", subTopics: ["Limit definition", "Limit laws", "Indeterminate forms"] },
            { title: "Continuity", subTopics: ["Continuity at a point", "Types of discontinuities", "Intermediate value theorem"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "differentiation-and-applications",
          title: "Differentiation and Its Applications",
          summary: "Derivative rules, chain rule, implicit differentiation, and applications to optimization.",
          topics: [
            { title: "Derivatives", subTopics: ["Derivative rules", "Chain rule", "Implicit and logarithmic differentiation"] },
            { title: "Applications", subTopics: ["Tangent and normal lines", "Maxima and minima", "Rate of change problems"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "integration-and-applications",
          title: "Integration and Its Applications",
          summary: "Integration techniques, definite integrals, and area/volume applications.",
          topics: [
            { title: "Techniques", subTopics: ["Basic integration formulas", "Substitution method", "Integration by parts"] },
            { title: "Applications", subTopics: ["Definite integrals", "Area between curves", "Volumes of solids"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "matrices-and-determinants",
          title: "Matrices and Determinants",
          summary: "Matrix operations, determinants, inverse matrices, and systems of linear equations.",
          topics: [
            { title: "Matrix Algebra", subTopics: ["Types of matrices", "Addition and multiplication", "Transpose and inverse"] },
            { title: "Determinants", subTopics: ["Properties of determinants", "Cramer's rule", "Solving linear systems"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "sequence-and-series",
          title: "Sequence and Series",
          summary: "Arithmetic and geometric progressions, convergence, and power series basics.",
          topics: [
            { title: "Progressions", subTopics: ["Arithmetic progressions", "Geometric progressions", "Harmonic sequences"] },
            { title: "Series", subTopics: ["Convergence tests", "Infinite series", "Binomial and exponential series"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [],
    },
    {
      code: "PHY118",
      slug: "physics",
      title: "Physics",
      credits: "3",
      overview:
        "Mechanics, oscillations and waves, heat and thermodynamics, optics, electricity, magnetism, and modern physics.",
      units: [
        {
          slug: "mechanics",
          title: "Mechanics",
          summary: "Rotational dynamics, simple harmonic motion, elasticity, and fluid mechanics basics.",
          topics: [
            { title: "Rotational Dynamics", subTopics: ["Torque and angular momentum", "Moment of inertia", "Rolling motion"] },
            { title: "Oscillations and Elasticity", subTopics: ["Simple harmonic motion", "Damped and forced oscillations", "Stress, strain, and modulus"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "oscillations-and-waves",
          title: "Oscillations and Waves",
          summary: "Wave motion, sound waves, superposition, and wave phenomena.",
          topics: [
            { title: "Wave Motion", subTopics: ["Types of waves", "Wave equation basics", "Energy transport"] },
            { title: "Sound", subTopics: ["Sound propagation", "Interference and beats", "Doppler effect"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "heat-and-thermodynamics",
          title: "Heat and Thermodynamics",
          summary: "Laws of thermodynamics, kinetic theory, and heat transfer mechanisms.",
          topics: [
            { title: "Thermodynamics", subTopics: ["Zeroth and first laws", "Second law and entropy", "Thermodynamic processes"] },
            { title: "Kinetic Theory", subTopics: ["Ideal gas behavior", "Temperature and energy", "Heat transfer modes"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "optics",
          title: "Optics",
          summary: "Geometrical optics, lenses, interference, diffraction, and polarization.",
          topics: [
            { title: "Geometrical Optics", subTopics: ["Reflection and refraction", "Lens equations", "Optical instruments"] },
            { title: "Physical Optics", subTopics: ["Interference", "Diffraction", "Polarization"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "electricity-and-magnetism",
          title: "Electricity and Magnetism",
          summary: "Electrostatics, DC circuits, magnetic fields, and electromagnetic induction.",
          topics: [
            { title: "Electrostatics", subTopics: ["Coulomb's law", "Electric field and potential", "Capacitors"] },
            { title: "Circuits and Magnetism", subTopics: ["Ohm's law and DC circuits", "Magnetic fields and forces", "Electromagnetic induction"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "modern-physics",
          title: "Modern Physics",
          summary: "Relativity basics, quantum concepts, atomic structure, and nuclear physics.",
          topics: [
            { title: "Quantum Concepts", subTopics: ["Photoelectric effect", "Wave-particle duality", "Bohr model"] },
            { title: "Nuclear Physics", subTopics: ["Radioactivity", "Fission and fusion", "Nuclear applications"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [
        { slug: "lab-1-mechanics-oscillations", title: "Lab 1: Mechanics and Oscillations", summary: "Experiments on moment of inertia and simple harmonic motion.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-2-optics", title: "Lab 2: Optics", summary: "Experiments with lenses, interference, and diffraction.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-3-electricity", title: "Lab 3: Electricity", summary: "Experiments on circuits, resistance, and electromagnetic induction.", notes: { pdf: [], handwritten: [] } },
      ],
    },
  ],
};