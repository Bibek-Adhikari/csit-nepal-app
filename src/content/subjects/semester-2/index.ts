import type { Semester } from "../types";

export const semester2: Semester = {
  key: "semester-2",
  label: "Semester 2",
  overview: "Discrete structures, object oriented programming, microprocessors, mathematics II, and statistics.",
  subjects: [
    {
      code: "CSC165",
      slug: "discrete-structures",
      title: "Discrete Structures",
      credits: "3",
      overview:
        "Set theory, logic, relations, functions, combinatorics, graph theory, and Boolean algebra — the mathematical foundation of computing.",
      units: [
        {
          slug: "set-theory",
          title: "Set Theory",
          summary: "Sets, subsets, power sets, Cartesian products, set operations, Venn diagrams, and set identities.",
          topics: [
            { title: "Basic Concepts", subTopics: ["Sets and membership", "Subsets and power sets", "Cardinality"] },
            { title: "Operations", subTopics: ["Union, intersection, difference", "Complement and symmetric difference", "Set identities and proofs"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "logic-and-proofs",
          title: "Logic and Proofs",
          summary: "Propositions, logical operators, truth tables, predicates, quantifiers, and proof methods.",
          topics: [
            { title: "Propositional Logic", subTopics: ["Propositions and connectives", "Truth tables", "Logical equivalence and implication"] },
            { title: "Predicates and Proofs", subTopics: ["Quantifiers", "Proof techniques", "Mathematical induction"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "relations-and-functions",
          title: "Relations and Functions",
          summary: "Binary relations, equivalence relations, partial orders, and the properties of functions.",
          topics: [
            { title: "Relations", subTopics: ["Relations and their properties", "Equivalence relations", "Partial orders and Hasse diagrams"] },
            { title: "Functions", subTopics: ["Function types", "Composition and inverse", "Growth of functions"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "combinatorics",
          title: "Combinatorics",
          summary: "Counting principles, permutations, combinations, binomial theorem, and the pigeonhole principle.",
          topics: [
            { title: "Counting", subTopics: ["Sum and product rules", "Permutations and combinations", "Binomial coefficients"] },
            { title: "Advanced Counting", subTopics: ["Pigeonhole principle", "Inclusion-exclusion", "Recurrence relations"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "graph-theory",
          title: "Graph Theory",
          summary: "Graph definitions, connectivity, Euler and Hamiltonian paths, and graph coloring.",
          topics: [
            { title: "Graph Basics", subTopics: ["Graphs and digraphs", "Degrees and adjacency", "Connectivity"] },
            { title: "Paths and Cycles", subTopics: ["Euler paths and circuits", "Hamiltonian cycles", "Shortest path problems"] },
            { title: "Graph Properties", subTopics: ["Planar graphs", "Graph coloring", "Matching and covers"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "trees-and-boolean-algebra",
          title: "Trees and Boolean Algebra",
          summary: "Tree properties, spanning trees, traversal, and Boolean algebra fundamentals.",
          topics: [
            { title: "Trees", subTopics: ["Tree properties", "Spanning trees", "Tree traversals"] },
            { title: "Boolean Algebra", subTopics: ["Boolean expressions", "Boolean functions", "Application to logic circuits"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [],
    },
    {
      code: "CSC166",
      slug: "object-oriented-programming",
      title: "Object Oriented Programming",
      credits: "3",
      overview:
        "Object oriented programming in C++: classes, objects, inheritance, polymorphism, templates, and file handling.",
      units: [
        {
          slug: "introduction-to-oop",
          title: "Introduction to Object Oriented Programming",
          summary: "Procedural vs OOP paradigm, classes, objects, encapsulation, abstraction, and C++ basics.",
          topics: [
            { title: "OOP Concepts", subTopics: ["Classes and objects", "Encapsulation and abstraction", "Inheritance and polymorphism overview"] },
            { title: "C++ Fundamentals", subTopics: ["Tokens and data types", "Input/output streams", "Functions and inline functions"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "classes-and-objects",
          title: "Classes and Objects",
          summary: "Class definition, constructors, destructors, friend functions, and passing objects.",
          topics: [
            { title: "Class Design", subTopics: ["Access specifiers", "Member functions", "Data members and this pointer"] },
            { title: "Construction", subTopics: ["Constructors and types", "Destructors", "Static and const members"] },
            { title: "Object Usage", subTopics: ["Arrays of objects", "Objects as arguments", "Friend functions and classes"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "inheritance-and-polymorphism",
          title: "Inheritance and Polymorphism",
          summary: "Types of inheritance, base and derived classes, virtual functions, and abstract classes.",
          topics: [
            { title: "Inheritance", subTopics: ["Single and multiple inheritance", "Multilevel and hierarchical inheritance", "Access control in inheritance"] },
            { title: "Polymorphism", subTopics: ["Function overloading", "Virtual functions", "Abstract classes and interfaces"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "operator-overloading",
          title: "Operator Overloading",
          summary: "Overloading unary and binary operators, rules, and friend-based overloading.",
          topics: [
            { title: "Overview", subTopics: ["Unary operator overloading", "Binary operator overloading", "Overload restrictions"] },
            { title: "Advanced", subTopics: ["Friend operator functions", "Type conversion operators", "I/O operators"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "templates-and-exception-handling",
          title: "Templates and Exception Handling",
          summary: "Function templates, class templates, and C++ exception handling mechanisms.",
          topics: [
            { title: "Templates", subTopics: ["Function templates", "Class templates", "Template specialization"] },
            { title: "Exceptions", subTopics: ["try, throw, catch", "Exception classes", "Standard exceptions"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "file-handling-and-streams",
          title: "File Handling and Streams",
          summary: "C++ streams, file input/output, random access, and error handling in file operations.",
          topics: [
            { title: "File I/O", subTopics: ["ifstream and ofstream", "Text and binary files", "Random access files"] },
            { title: "Streams", subTopics: ["Stream classes", "Manipulators", "Error state handling"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [
        { slug: "lab-1-classes-objects", title: "Lab 1: Classes and Objects", summary: "Programs demonstrating classes, constructors, and access specifiers.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-2-inheritance", title: "Lab 2: Inheritance and Polymorphism", summary: "Programs on inheritance, virtual functions, and overloaded operators.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-3-templates-exceptions", title: "Lab 3: Templates and Exceptions", summary: "Programs using templates and exception handling.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-4-files", title: "Lab 4: File Handling", summary: "Programs performing text and binary file operations.", notes: { pdf: [], handwritten: [] } },
      ],
    },
    {
      code: "CSC167",
      slug: "microprocessor",
      title: "Microprocessor",
      credits: "3",
      overview:
        "Intel 8085 microprocessor architecture, instruction set, assembly programming, interrupts, and interfacing.",
      units: [
        {
          slug: "introduction-and-architecture",
          title: "Introduction to Microprocessor and 8085 Architecture",
          summary: "Microprocessor evolution, 8085 architecture, registers, ALU, and bus organization.",
          topics: [
            { title: "Fundamentals", subTopics: ["Microprocessor vs microcontroller", "Von Neumann architecture", "Evolution of processors"] },
            { title: "8085 Architecture", subTopics: ["Registers and flags", "ALU and accumulator", "Address and data buses"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "instruction-set-and-addressing-modes",
          title: "Instruction Set and Addressing Modes",
          summary: "8085 instruction classification, addressing modes, and data transfer instructions.",
          topics: [
            { title: "Instruction Set", subTopics: ["Data transfer instructions", "Arithmetic and logical instructions", "Branch and control instructions"] },
            { title: "Addressing Modes", subTopics: ["Immediate, direct, indirect", "Register and register indirect", "Implied addressing"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "assembly-language-programming",
          title: "Assembly Language Programming",
          summary: "Assembly language format, programming techniques, subroutines, and stack operations.",
          topics: [
            { title: "Programming", subTopics: ["Assembly directives", "Simple programs", "Loops and delays"] },
            { title: "Subroutines", subTopics: ["CALL and RET", "Stack operations", "Parameter passing"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "timing-diagram-and-machine-cycles",
          title: "Timing Diagram and Machine Cycles",
          summary: "Fetch, decode, execute cycles, timing diagrams, and memory read/write operations.",
          topics: [
            { title: "Execution Cycles", subTopics: ["Fetch cycle", "Machine cycles", "Instruction cycle"] },
            { title: "Timing", subTopics: ["Timing diagram conventions", "Memory read and write", "I/O read and write"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "interrupts",
          title: "Interrupt Structure",
          summary: "Interrupt mechanism, INTR/TRAP/RST interrupts, priority, and interrupt masking.",
          topics: [
            { title: "Interrupts", subTopics: ["Interrupt concept", "Hardware vs software interrupts", "Interrupt priorities"] },
            { title: "8085 Interrupts", subTopics: ["TRAP, RST 7.5/6.5/5.5", "INTR and INTA", "Masking techniques"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "memory-and-io-interfacing",
          title: "Memory and I/O Interfacing",
          summary: "Memory mapping, address decoding, I/O mapped I/O, and peripheral interfaces.",
          topics: [
            { title: "Memory Interfacing", subTopics: ["Memory mapping concepts", "Address decoding", "Memory chip selection"] },
            { title: "I/O Interfacing", subTopics: ["Memory vs I/O mapped I/O", "Input/output ports", "8255 PPI overview"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "peripherals-and-applications",
          title: "Peripherals and Applications",
          summary: "Support chips 8253, 8259, 8251, and typical microprocessor applications.",
          topics: [
            { title: "Support Chips", subTopics: ["8253 timer/counter", "8259 interrupt controller", "8251 USART"] },
            { title: "Applications", subTopics: ["LED and keyboard interfacing", "Stepper motor control", "Embedded system examples"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [
        { slug: "lab-1-instruction-set", title: "Lab 1: Instruction Set Basics", summary: "Programs using data transfer and arithmetic instructions.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-2-assembly-programs", title: "Lab 2: Assembly Programs", summary: "Programs involving loops, delays, and decision making.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-3-subroutines", title: "Lab 3: Subroutines and Stack", summary: "Programs using subroutines and stack operations.", notes: { pdf: [], handwritten: [] } },
        { slug: "lab-4-interfacing", title: "Lab 4: Interfacing", summary: "Experiments with LEDs, switches, and 8255-based I/O.", notes: { pdf: [], handwritten: [] } },
      ],
    },
    {
      code: "MTH168",
      slug: "mathematics-ii",
      title: "Mathematics II",
      credits: "3",
      overview:
        "Complex numbers, vectors, three-dimensional geometry, differential equations, and Laplace transforms.",
      units: [
        {
          slug: "complex-numbers",
          title: "Complex Numbers",
          summary: "Complex number operations, polar form, De Moivre's theorem, and roots of complex numbers.",
          topics: [
            { title: "Fundamentals", subTopics: ["Operations on complex numbers", "Conjugate and modulus", "Polar form"] },
            { title: "Advanced Topics", subTopics: ["De Moivre's theorem", "Roots of unity", "Applications"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "vectors",
          title: "Vectors and Their Applications",
          summary: "Vector operations, dot and cross products, lines and planes, and applications.",
          topics: [
            { title: "Vector Algebra", subTopics: ["Vector addition and scaling", "Dot product", "Cross product"] },
            { title: "Applications", subTopics: ["Equations of lines", "Equations of planes", "Geometry applications"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "analytic-geometry-in-three-dimensions",
          title: "Analytic Geometry in Three Dimensions",
          summary: "Coordinates in 3D, surfaces, and quadric surfaces.",
          topics: [
            { title: "3D Coordinates", subTopics: ["Coordinate systems", "Distance and section formulas", "Direction cosines"] },
            { title: "Surfaces", subTopics: ["Cylinders", "Quadric surfaces", "Standard equations"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "first-order-differential-equations",
          title: "First Order Differential Equations",
          summary: "Solution methods, exact equations, linear equations, and applications.",
          topics: [
            { title: "Solution Methods", subTopics: ["Separable equations", "Homogeneous equations", "Exact equations"] },
            { title: "Linear Equations", subTopics: ["Integrating factors", "Bernoulli equations", "Modeling applications"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "linear-differential-equations",
          title: "Linear Differential Equations",
          summary: "Higher order linear equations, auxiliary equations, and undetermined coefficients.",
          topics: [
            { title: "Higher Order Equations", subTopics: ["Homogeneous equations", "Auxiliary equations", "Complex roots"] },
            { title: "Particular Solutions", subTopics: ["Undetermined coefficients", "Variation of parameters", "Applications"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "laplace-transforms",
          title: "Laplace Transforms",
          summary: "Laplace transform definition, properties, inverse transforms, and solving differential equations.",
          topics: [
            { title: "Transforms", subTopics: ["Definition and basic transforms", "Properties", "Shift theorems"] },
            { title: "Applications", subTopics: ["Inverse transforms", "Solving differential equations", "Step and impulse functions"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [],
    },
    {
      code: "STA169",
      slug: "statistics-i",
      title: "Statistics I",
      credits: "3",
      overview:
        "Descriptive statistics, central tendency, dispersion, correlation, regression, probability, and distributions.",
      units: [
        {
          slug: "introduction-to-statistics",
          title: "Introduction to Statistics",
          summary: "Scope of statistics, data types, data collection, and presentation of data.",
          topics: [
            { title: "Data", subTopics: ["Types of data", "Data collection methods", "Sampling techniques"] },
            { title: "Presentation", subTopics: ["Frequency distributions", "Graphical representation", "Tables and charts"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "measures-of-central-tendency",
          title: "Measures of Central Tendency",
          summary: "Mean, median, mode, quartiles, and their properties.",
          topics: [
            { title: "Averages", subTopics: ["Arithmetic mean", "Median and mode", "Geometric and harmonic means"] },
            { title: "Positional Measures", subTopics: ["Quartiles and percentiles", "Choice of measure", "Box plots"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "measures-of-dispersion",
          title: "Measures of Dispersion",
          summary: "Range, variance, standard deviation, coefficient of variation, and skewness.",
          topics: [
            { title: "Variability", subTopics: ["Range and quartile deviation", "Variance and standard deviation", "Coefficient of variation"] },
            { title: "Shape", subTopics: ["Skewness", "Kurtosis", "Moments"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "correlation-and-regression",
          title: "Correlation and Regression",
          summary: "Correlation coefficients, rank correlation, and simple linear regression.",
          topics: [
            { title: "Correlation", subTopics: ["Scatter diagrams", "Pearson's coefficient", "Spearman's rank correlation"] },
            { title: "Regression", subTopics: ["Regression lines", "Least squares method", "Prediction and interpretation"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "probability",
          title: "Probability",
          summary: "Probability concepts, axioms, conditional probability, and Bayes' theorem.",
          topics: [
            { title: "Fundamentals", subTopics: ["Sample spaces and events", "Probability axioms", "Counting methods"] },
            { title: "Conditional Probability", subTopics: ["Conditional probability", "Independence", "Bayes' theorem"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "probability-distributions-and-sampling",
          title: "Probability Distributions and Sampling",
          summary: "Discrete and continuous distributions, expectation, and sampling distributions.",
          topics: [
            { title: "Discrete Distributions", subTopics: ["Random variables", "Binomial distribution", "Poisson distribution"] },
            { title: "Continuous Distributions", subTopics: ["Normal distribution", "Expectation and variance", "Sampling distributions"] },
          ],
          notes: { pdf: [], handwritten: [] },
        },
      ],
      labReports: [],
    },
  ],
};