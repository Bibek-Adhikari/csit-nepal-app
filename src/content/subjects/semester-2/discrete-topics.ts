import type { Topic } from "../types";

export const discreteMathTopics: Record<string, Topic[]> = {
  "set-theory": [
    { title: "Sets and Fundamentals", subTopics: ["Definition and representation of sets", "Roster method and set-builder notation", "Finite and infinite sets", "Empty set, singleton set, universal set", "Equal sets and equivalent sets", "Cardinal number of a set"] },
    { title: "Subsets and Power Sets", subTopics: ["Subsets and proper subsets", "Number of subsets of a finite set", "Power set and its cardinality", "Cartesian product of sets", "Venn diagrams and applications"] },
    { title: "Set Operations", subTopics: ["Union and intersection of sets", "Difference and complement of sets", "Symmetric difference", "Disjoint sets", "Properties of set operations"] },
    { title: "Set Identities and Applications", subTopics: ["De Morgan's laws", "Laws of complementation", "Associative and distributive laws", "Proof of set identities using membership tables", "Applications in real-world problems"] },
  ],
  "logic-propositional-calculus": [
    { title: "Propositional Logic", subTopics: ["Propositions and truth values", "Atomic and compound propositions", "Negation, conjunction, disjunction", "Implication and biconditional", "Conditional and converse statements"] },
    { title: "Truth Tables and Logical Equivalence", subTopics: ["Constructing truth tables", "Tautologies and contradictions", "Logical equivalence", "Laws of logic", "De Morgan's laws for logic"] },
    { title: "Predicates and Quantifiers", subTopics: ["Predicate logic", "Universal quantifier", "Existential quantifier", "Negation of quantified statements", "Nested quantifiers"] },
    { title: "Methods of Proof", subTopics: ["Direct proof", "Proof by contradiction", "Proof by contrapositive", "Proof by cases", "Existence and uniqueness proofs"] },
  ],
  "relations-functions": [
    { title: "Relations", subTopics: ["Binary relations on sets", "Domain and range of relations", "Representation of relations (matrices, digraphs)", "Properties of relations (reflexive, symmetric, transitive)", "Equivalence relations and equivalence classes", "Partial orders and Hasse diagrams"] },
    { title: "Functions", subTopics: ["Definition and notation of functions", "Domain, codomain, and range", "Types of functions (injective, surjective, bijective)", "Composition of functions", "Inverse functions", "Identity functions"] },
    { title: "Special Functions", subTopics: ["Floor and ceiling functions", "Characteristic functions", "Permutations as bijective functions", "Growth of functions (Big-O notation)", "Pigeonhole principle and its applications"] },
  ],
  "mathematical-reasoning-proofs": [
    { title: "Mathematical Induction", subTopics: ["Principle of mathematical induction", "Base case and inductive step", "Examples using induction", "Strong induction", "Structural induction"] },
    { title: "Recursive Definitions", subTopics: ["Recursively defined functions", "Recursively defined sets", "Recursive algorithms", "Fibonacci sequence and recurrence relations", "Solving simple recurrence relations"] },
    { title: "Proof Techniques", subTopics: ["Direct proof method", "Proof by contradiction", "Proof by contraposition", "Proof by exhaustion", "Counterexamples"] },
  ],
  "combinatorics-counting": [
    { title: "Basic Counting Principles", subTopics: ["Sum rule (addition principle)", "Product rule (multiplication principle)", "Inclusion-exclusion principle", "Pigeonhole principle", "Dirichlet's box principle"] },
    { title: "Permutations and Combinations", subTopics: ["Permutations of distinct objects", "Circular permutations", "Permutations with repetitions", "Combinations and binomial coefficients", "Pascal's identity and Pascal's triangle"] },
    { title: "Binomial Theorem", subTopics: ["Binomial theorem statement", "Proof by induction", "Applications in expansions", "Finding specific terms", "Multinomial theorem"] },
    { title: "Recurrence Relations", subTopics: ["Definition and examples", "Linear recurrence relations", "Homogeneous recurrence relations", "Particular solutions", "Solving recurrence relations"] },
  ],
  "graph-theory-trees": [
    { title: "Graph Theory Fundamentals", subTopics: ["Definition of graphs and multigraphs", "Directed and undirected graphs", "Degree of a vertex", "Handshaking lemma", "Complete graphs, bipartite graphs", "Subgraphs and isomorphism"] },
    { title: "Paths and Circuits", subTopics: ["Walks, trails, and paths", "Connected and disconnected graphs", "Euler paths and Euler circuits", "Hamilton paths and Hamilton circuits", "Shortest path problem"] },
    { title: "Trees", subTopics: ["Definition and properties of trees", "Rooted trees and terminology", "Spanning trees", "Minimum spanning trees (Kruskyal's, Prim's)", "Tree traversals (preorder, inorder, postorder)"] },
    { title: "Graph Representations", subTopics: ["Adjacency matrix", "Incidence matrix", "Adjacency list representation", "Graph coloring", "Planar graphs"] },
  ],
  "algebraic-structures": [
    { title: "Groups", subTopics: ["Definition of a group", "Properties of groups", "Finite and infinite groups", "Subgroups and their tests", "Cyclic groups"] },
    { title: "Cosets and Lagrange's Theorem", subTopics: ["Definition of cosets", "Properties of cosets", "Lagrange's theorem", "Normal subgroups", "Quotient groups"] },
    { title: "Rings and Fields", subTopics: ["Definition of rings", "Properties of rings", "Subrings", "Ideals", "Fields and their properties"] },
    { title: "Boolean Algebra", subTopics: ["Definition of Boolean algebra", "Boolean functions", "Logic gates and circuits", "Karnaugh maps", "Simplification of Boolean expressions"] },
  ],
};
