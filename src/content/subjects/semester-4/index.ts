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
          notes: {
            pdf: [{ title: "OS PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/operating-system/process-management/process-management.pdf", format: "pdf" }],
            handwritten: [{ title: "OS Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/operating-system/process-management/process-management-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "memory-storage",
          title: "Memory and Storage",
          summary: "Paging, segmentation, virtual memory, and filesystems.",
          notes: {
            pdf: [{ title: "Memory PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/operating-system/memory-storage/memory-storage.pdf", format: "pdf" }],
            handwritten: [{ title: "Memory Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/operating-system/memory-storage/memory-storage-handwritten.pdf", format: "handwritten" }],
          },
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
          notes: {
            pdf: [{ title: "Networks PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/computer-networks/layers/layers.pdf", format: "pdf" }],
            handwritten: [{ title: "Networks Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/computer-networks/layers/layers-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "routing-and-transport",
          title: "Routing and Transport",
          summary: "Subnetting, OSPF, TCP, UDP, and services.",
          notes: {
            pdf: [{ title: "Routing PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/computer-networks/routing-and-transport/routing-and-transport.pdf", format: "pdf" }],
            handwritten: [{ title: "Routing Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/computer-networks/routing-and-transport/routing-and-transport-handwritten.pdf", format: "handwritten" }],
          },
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
          notes: {
            pdf: [{ title: "Web Tech II PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/web-technology-ii/backend-foundations/backend-foundations.pdf", format: "pdf" }],
            handwritten: [{ title: "Web Tech II Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/web-technology-ii/backend-foundations/backend-foundations-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "security-and-auth",
          title: "Security and Auth",
          summary: "JWT, SQL injection, and XSS protection.",
          notes: {
            pdf: [{ title: "Security PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/web-technology-ii/security-and-auth/security-and-auth.pdf", format: "pdf" }],
            handwritten: [{ title: "Security Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/web-technology-ii/security-and-auth/security-and-auth-handwritten.pdf", format: "handwritten" }],
          },
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
          notes: {
            pdf: [{ title: "Scripting PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/scripting-language/python-basics/python-basics.pdf", format: "pdf" }],
            handwritten: [{ title: "Scripting Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/scripting-language/python-basics/python-basics-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "regex-and-automation",
          title: "Regex and Automation",
          summary: "Patterns, scraping, and task automation.",
          notes: {
            pdf: [{ title: "Automation PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/scripting-language/regex-and-automation/regex-and-automation.pdf", format: "pdf" }],
            handwritten: [{ title: "Automation Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/scripting-language/regex-and-automation/regex-and-automation-handwritten.pdf", format: "handwritten" }],
          },
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
          notes: {
            pdf: [{ title: "SAD PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/system-analysis-and-design/analysis-methods/analysis-methods.pdf", format: "pdf" }],
            handwritten: [{ title: "SAD Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/system-analysis-and-design/analysis-methods/analysis-methods-handwritten.pdf", format: "handwritten" }],
          },
        },
        {
          slug: "design-and-deployment",
          title: "Design and Deployment",
          summary: "Sequence diagrams, architectures, and release strategy.",
          notes: {
            pdf: [{ title: "Design PDF Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/system-analysis-and-design/design-and-deployment/design-and-deployment.pdf", format: "pdf" }],
            handwritten: [{ title: "Design Handwritten Notes", href: "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-4/system-analysis-and-design/design-and-deployment/design-and-deployment-handwritten.pdf", format: "handwritten" }],
          },
        },
      ],
    },
  ],
};