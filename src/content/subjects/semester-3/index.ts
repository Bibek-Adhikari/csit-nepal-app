import type { Semester } from "../types";

export const semester3: Semester = {
  key: "semester-3",
  label: "Semester 3",
  overview: "Core development, data handling, statistics, and software engineering.",
  subjects: [
    {
      code: "CACS 201",
      slug: "data-structures-algorithms",
      title: "Data Structures & Algorithms",
      credits: "3",
      overview: "Lists, stacks, queues, trees, graphs, sorting, and hashing.",
      units: [
        {
          slug: "linear-structures",
          title: "Linear Data Structures",
          summary: "Arrays, linked lists, stacks, and queues.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "trees-graphs",
          title: "Trees and Graphs",
          summary: "Traversals, shortest paths, spanning trees, and networks.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "CACS 202",
      slug: "database-management-system",
      title: "Database Management System",
      credits: "3",
      overview: "ER modeling, relational algebra, SQL, normalization, and transactions.",
      units: [
        {
          slug: "relational-model",
          title: "Relational Model",
          summary: "Schema design, keys, constraints, and normalization.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "sql-and-transactions",
          title: "SQL and Transactions",
          summary: "Queries, joins, indexing, ACID, and concurrency control.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "CACS 203",
      slug: "web-technology-i",
      title: "Web Technology I",
      credits: "3",
      overview: "HTML, CSS, JavaScript, async flows, and browser storage.",
      units: [
        {
          slug: "frontend-foundations",
          title: "Frontend Foundations",
          summary: "Semantic HTML, responsive CSS, and component layouts.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "javascript-and-storage",
          title: "JavaScript and Storage",
          summary: "Events, promises, async/await, and client storage.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "CAST 204",
      slug: "probability-statistics",
      title: "Probability & Statistics",
      credits: "3",
      overview: "Probability, distributions, sampling, and hypothesis testing.",
      units: [
        {
          slug: "probability-basics",
          title: "Probability Basics",
          summary: "Events, conditional probability, and Bayes theorem.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "testing",
          title: "Statistical Testing",
          summary: "Sampling, confidence intervals, and z/t tests.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "CACS 205",
      slug: "software-engineering",
      title: "Software Engineering",
      credits: "3",
      overview: "Process models, requirements, architecture, verification, and metrics.",
      units: [
        {
          slug: "process-models",
          title: "Process Models",
          summary: "Waterfall, iterative, agile, and Scrum.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "testing-and-quality",
          title: "Testing and Quality",
          summary: "Verification, validation, metrics, and maintenance.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
  ],
};