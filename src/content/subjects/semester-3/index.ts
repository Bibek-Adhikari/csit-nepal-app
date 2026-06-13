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
          notes: {
            pdf: [{ title: "DSA PDF Notes", href: "/notes/semester-3/data-structures-algorithms/linear-structures.pdf", format: "pdf" }],
            handwritten: [{ title: "DSA Handwritten Notes", href: "/notes/semester-3/data-structures-algorithms/linear-structures-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "trees-graphs",
          title: "Trees and Graphs",
          summary: "Traversals, shortest paths, spanning trees, and networks.",
          notes: {
            pdf: [{ title: "Trees & Graphs PDF Notes", href: "/notes/semester-3/data-structures-algorithms/trees-graphs.pdf", format: "pdf" }],
            handwritten: [{ title: "Trees & Graphs Handwritten Notes", href: "/notes/semester-3/data-structures-algorithms/trees-graphs-handwritten.pdf", format: "handwritten" }],
          },
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
          notes: {
            pdf: [{ title: "DBMS PDF Notes", href: "/notes/semester-3/database-management-system/relational-model.pdf", format: "pdf" }],
            handwritten: [{ title: "DBMS Handwritten Notes", href: "/notes/semester-3/database-management-system/relational-model-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "sql-and-transactions",
          title: "SQL and Transactions",
          summary: "Queries, joins, indexing, ACID, and concurrency control.",
          notes: {
            pdf: [{ title: "SQL PDF Notes", href: "/notes/semester-3/database-management-system/sql-and-transactions.pdf", format: "pdf" }],
            handwritten: [{ title: "SQL Handwritten Notes", href: "/notes/semester-3/database-management-system/sql-and-transactions-handwritten.pdf", format: "handwritten" }],
          },
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
          notes: {
            pdf: [{ title: "Web Tech I PDF Notes", href: "/notes/semester-3/web-technology-i/frontend-foundations.pdf", format: "pdf" }],
            handwritten: [{ title: "Web Tech I Handwritten Notes", href: "/notes/semester-3/web-technology-i/frontend-foundations-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "javascript-and-storage",
          title: "JavaScript and Storage",
          summary: "Events, promises, async/await, and client storage.",
          notes: {
            pdf: [{ title: "JS PDF Notes", href: "/notes/semester-3/web-technology-i/javascript-and-storage.pdf", format: "pdf" }],
            handwritten: [{ title: "JS Handwritten Notes", href: "/notes/semester-3/web-technology-i/javascript-and-storage-handwritten.pdf", format: "handwritten" }],
          },
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
          notes: {
            pdf: [{ title: "Probability PDF Notes", href: "/notes/semester-3/probability-statistics/probability-basics.pdf", format: "pdf" }],
            handwritten: [{ title: "Probability Handwritten Notes", href: "/notes/semester-3/probability-statistics/probability-basics-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "testing",
          title: "Statistical Testing",
          summary: "Sampling, confidence intervals, and z/t tests.",
          notes: {
            pdf: [{ title: "Statistics PDF Notes", href: "/notes/semester-3/probability-statistics/testing.pdf", format: "pdf" }],
            handwritten: [{ title: "Statistics Handwritten Notes", href: "/notes/semester-3/probability-statistics/testing-handwritten.pdf", format: "handwritten" }],
          },
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
          notes: {
            pdf: [{ title: "SE PDF Notes", href: "/notes/semester-3/software-engineering/process-models.pdf", format: "pdf" }],
            handwritten: [{ title: "SE Handwritten Notes", href: "/notes/semester-3/software-engineering/process-models-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "testing-and-quality",
          title: "Testing and Quality",
          summary: "Verification, validation, metrics, and maintenance.",
          notes: {
            pdf: [{ title: "Testing PDF Notes", href: "/notes/semester-3/software-engineering/testing-and-quality.pdf", format: "pdf" }],
            handwritten: [{ title: "Testing Handwritten Notes", href: "/notes/semester-3/software-engineering/testing-and-quality-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
  ],
};