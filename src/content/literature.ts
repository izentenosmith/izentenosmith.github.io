export type Book = { title: string; authors: string }

export type Paper = { title: string; source: string; year?: number; href: string }

export type Group<T> = { label: string; items: T[] }

export const books: Group<Book>[] = [
  {
    label: 'Architecture & design',
    items: [
      { title: 'Fundamentals of Software Architecture', authors: 'Mark Richards & Neal Ford' },
      {
        title: 'Software Architecture: The Hard Parts',
        authors: 'Neal Ford, Mark Richards, Pramod Sadalage & Zhamak Dehghani',
      },
      { title: 'Clean Architecture', authors: 'Robert C. Martin' },
      { title: 'A Philosophy of Software Design', authors: 'John Ousterhout' },
      { title: 'Refactoring', authors: 'Martin Fowler' },
      { title: 'Modern Software Engineering', authors: 'David Farley' },
    ],
  },
  {
    label: 'Data & databases',
    items: [
      { title: 'Designing Data-Intensive Applications', authors: 'Martin Kleppmann' },
      { title: 'Fundamentals of Database Systems', authors: 'Ramez Elmasri & Shamkant B. Navathe' },
      {
        title: 'Database Systems: A Practical Approach to Design, Implementation, and Management',
        authors: 'Thomas Connolly & Carolyn Begg',
      },
      { title: 'Beginning Database Design', authors: 'Clare Churcher' },
      { title: 'CASE*Method: Entity Relationship Modelling', authors: 'Richard Barker' },
      { title: 'The Theory of Relational Databases', authors: 'David Maier' },
      { title: 'The Data Warehouse Toolkit', authors: 'Ralph Kimball' },
      { title: 'SQL Performance Explained', authors: 'Markus Winand' },
      { title: 'Introduction to Object-Relational Database Development', authors: 'Cyrus Shahabi' },
    ],
  },
  {
    label: 'Delivery & operations',
    items: [
      { title: 'Continuous Delivery', authors: 'Jez Humble & David Farley' },
      { title: 'The DevOps Handbook', authors: 'Gene Kim, Jez Humble, Patrick Debois & John Willis' },
      {
        title: 'Site Reliability Engineering',
        authors: 'Betsy Beyer, Chris Jones, Jennifer Petoff & Niall Murphy',
      },
      { title: 'Infrastructure as Code', authors: 'Kief Morris' },
      { title: 'The Terraform Book', authors: 'James Turnbull' },
    ],
  },
  {
    label: 'Systems',
    items: [
      { title: 'Operating System Concepts', authors: 'Abraham Silberschatz, Peter B. Galvin & Greg Gagne' },
    ],
  },
]

export const papers: Group<Paper>[] = [
  {
    label: 'AI agents',
    items: [
      {
        title: 'Harness design for long-running apps',
        source: 'Anthropic',
        year: 2026,
        href: 'https://www.anthropic.com/research/harness-design-long-running-apps',
      },
      {
        title: 'Demystifying evals for AI agents',
        source: 'Anthropic',
        year: 2026,
        href: 'https://www.anthropic.com/research/demystifying-evals-for-ai-agents',
      },
      {
        title: 'Effective harnesses for long-running agents',
        source: 'Anthropic',
        year: 2025,
        href: 'https://www.anthropic.com/research/effective-harnesses-for-long-running-agents',
      },
      {
        title: 'Making Claude Code safer with sandboxing',
        source: 'Anthropic',
        year: 2025,
        href: 'https://www.anthropic.com/research/claude-code-sandboxing',
      },
      {
        title: 'Equipping agents for the real world with Agent Skills',
        source: 'Anthropic',
        year: 2025,
        href: 'https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills',
      },
      {
        title: 'Effective context engineering for AI agents',
        source: 'Anthropic',
        year: 2025,
        href: 'https://www.anthropic.com/research/effective-context-engineering-for-ai-agents',
      },
      {
        title: 'Desktop Extensions: one-click MCP installs',
        source: 'Anthropic',
        year: 2025,
        href: 'https://www.anthropic.com/research/desktop-extensions',
      },
    ],
  },
  {
    label: 'Distributed systems & storage',
    items: [
      {
        title: "Dynamo: Amazon's Highly Available Key-value Store",
        source: 'SOSP',
        year: 2007,
        href: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',
      },
      {
        title: 'The Google File System',
        source: 'SOSP',
        year: 2003,
        href: 'https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf',
      },
      {
        title: 'Kafka: a Distributed Messaging System for Log Processing',
        source: 'NetDB',
        year: 2011,
        href: 'https://www.microsoft.com/en-us/research/wp-content/uploads/2017/09/Kafka.pdf',
      },
      {
        title: 'Amazon Aurora: Design Considerations for High Throughput Cloud-Native Relational Databases',
        source: 'SIGMOD',
        year: 2017,
        href: 'https://web.stanford.edu/class/cs245/readings/aurora.pdf',
      },
    ],
  },
  {
    label: 'Delivery',
    items: [
      {
        title: 'Top 5 most-used deployment strategies',
        source: 'ByteByteGo',
        href: 'https://bytebytego.com/guides/top-5-most-used-deployment-strategies/',
      },
    ],
  },
]
