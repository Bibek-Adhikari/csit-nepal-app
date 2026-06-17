import type { Semester } from "../types";

export const semester4: Semester = {
  key: "semester-4",
  label: "Semester 4",
  overview: "Operating systems, networking, backend web systems, scripting, and analysis.",
  subjects: [
    {
      code: "CACS 251",
      slug: "operating-system",
      title: "Operating System",
      credits: "3",
      overview: "Processes, threads, memory, scheduling, and deadlocks.",
      units: [
        {
          slug: "process-management",
          title: "Process Management",
          summary: "Scheduling, synchronization, and concurrency.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "memory-storage",
          title: "Memory and Storage",
          summary: "Paging, segmentation, virtual memory, and filesystems.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "CACS 252",
      slug: "computer-networks",
      title: "Computer Networks",
      credits: "3",
      overview: "OSI, TCP/IP, routing, transport, and application layers.",
      units: [
        {
          slug: "layers",
          title: "Network Layers",
          summary: "OSI and TCP/IP, media, framing, and flow control.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "routing-and-transport",
          title: "Routing and Transport",
          summary: "Subnetting, OSPF, TCP, UDP, and services.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "CACS 253",
      slug: "web-technology-ii",
      title: "Web Technology II",
      credits: "3",
      overview: "Node.js, Express, ORM, JWT, APIs, and security.",
      units: [
        {
          slug: "backend-foundations",
          title: "Backend Foundations",
          summary: "Node.js, routing, and REST architecture.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "security-and-auth",
          title: "Security and Auth",
          summary: "JWT, SQL injection, and XSS protection.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "CACS 254",
      slug: "scripting-language",
      title: "Scripting Language",
      credits: "3",
      overview: "Python scripting, automation, regex, and data handling.",
      units: [
        {
          slug: "python-basics",
          title: "Python and Data Handling",
          summary: "Lists, comprehensions, files, and automation.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "regex-and-automation",
          title: "Regex and Automation",
          summary: "Patterns, scraping, and task automation.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
    {
      code: "CACS 255",
      slug: "system-analysis-and-design",
      title: "System Analysis & Design",
      credits: "3",
      overview: "Feasibility, DFDs, UML, deployment, and maintenance.",
      units: [
        {
          slug: "analysis-methods",
          title: "Analysis Methods",
          summary: "Feasibility, requirements, and process modeling.",
          notes: { pdf: [], handwritten: [] },
        },
        {
          slug: "design-and-deployment",
          title: "Design and Deployment",
          summary: "Sequence diagrams, architectures, and release strategy.",
          notes: { pdf: [], handwritten: [] },
        },
      ],
    },
  ],
};