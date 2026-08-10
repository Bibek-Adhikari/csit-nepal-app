import type { Topic } from "../types";

export const math2Topics: Record<string, Topic[]> = {
  "limit-continuity": [
    { title: "Concept of Limits", subTopics: ["Definition of limit (informal and formal)", "Left-hand and right-hand limits", "Limit of a function (epsilon-delta definition)", "Algebra of limits", "Limits involving infinity"] },
    { title: "Techniques of Evaluating Limits", subTopics: ["Direct substitution method", "Factorization method", "Rationalization method", "L'Hospital's rule", "Special limits (sin x/x, (1+1/x)^x)"] },
    { title: "Continuity", subTopics: ["Definition of continuity at a point", "Continuity on an interval", "Types of discontinuities (removable, jump, infinite)", "Properties of continuous functions", "Intermediate value theorem"] },
  ],
  "derivatives": [
    { title: "Definition and Basic Rules", subTopics: ["Definition of derivative (first principles)", "Differentiability and continuity relationship", "Derivative by first principles", "Power rule and constant rule", "Sum and difference rule"] },
    { title: "Advanced Differentiation Rules", subTopics: ["Product rule", "Quotient rule", "Chain rule", "Implicit differentiation", "Logarithmic differentiation"] },
    { title: "Higher Order Derivatives", subTopics: ["Second and higher order derivatives", "Notation for higher order derivatives", "Applications of second derivative", "Partial derivatives", "Total differential"] },
  ],
  "applications-of-derivatives": [
    { title: "Maxima and Minima", subTopics: ["Critical points and stationary points", "First derivative test", "Second derivative test", "Absolute maxima and minima", "Applications in optimization problems"] },
    { title: "Tangents and Normals", subTopics: ["Equation of tangent line", "Equation of normal line", "Slope of tangent and normal", "Angle of intersection of curves", "Length of tangent and normal"] },
    { title: "Mean Value Theorems", subTopics: ["Rolle's theorem", "Lagrange's mean value theorem", "Cauchy's mean value theorem", "Taylor's theorem", "Maclaurin series expansion"] },
    { title: "Indeterminate Forms", subTopics: ["Indeterminate forms (0/0, infinity/infinity, 0*infinity)", "L'Hospital's rule application", "Evaluating limits using series expansion", "Form 0^0, 1^infinity, infinity^0", "Techniques for different indeterminate forms"] },
  ],
  "anti-derivative-applications": [
    { title: "Integration Basics", subTopics: ["Definition of antiderivative", "Indefinite integration", "Basic integration formulas", "Integration by substitution", "Integration by parts"] },
    { title: "Advanced Integration Techniques", subTopics: ["Integration using partial fractions", "Integration using trigonometric identities", "Trigonometric substitution", "Integration of special functions", "Reduction formulas"] },
    { title: "Definite Integration", subTopics: ["Definite integral definition", "Fundamental theorem of calculus", "Properties of definite integrals", "Area under a curve", "Area between two curves"] },
    { title: "Applications of Integration", subTopics: ["Volume of solids of revolution", "Arc length of curves", "Surface area of revolution", "Average value of a function", "Work and energy applications"] },
  ],
  "differential-equations": [
    { title: "First Order Differential Equations", subTopics: ["Definition and classification", "Order and degree of differential equations", "Variable separable method", "Homogeneous equations", "Linear first order equations"] },
    { title: "Advanced Solution Methods", subTopics: ["Exact equations", "Integrating factor method", "Bernoulli's equation", "Orthogonal trajectories", "Applications of first order ODEs"] },
    { title: "Second Order Differential Equations", subTopics: ["Homogeneous equations with constant coefficients", "Auxiliary equation", "Real and distinct roots", "Real and equal roots", "Complex conjugate roots"] },
    { title: "Applications of Differential Equations", subTopics: ["Growth and decay models", "Newton's law of cooling", "Simple harmonic motion", "RLC circuits", "Mixing problems"] },
  ],
  "computational-methods": [
    { title: "Root Finding Methods", subTopics: ["Bisection method (interval halving)", "Regula-Falsi method (false position)", "Newton-Raphson method", "Secant method", "Comparison of convergence rates"] },
    { title: "Linear Algebra Methods", subTopics: ["Gaussian elimination", "Gauss-Jordan elimination", "Matrix inversion methods", "LU decomposition", "Iterative methods (Jacobi, Gauss-Seidel)"] },
    { title: "Linear Programming", subTopics: ["Formulation of linear programming problems", "Graphical method", "Simplex method", "Duality in linear programming", "Transportation problems"] },
    { title: "Interpolation and Approximation", subTopics: ["Finite differences", "Newton's forward difference", "Newton's backward difference", "Lagrange's interpolation", "Least squares method"] },
  ],
};
