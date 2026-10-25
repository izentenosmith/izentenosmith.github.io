export type Role = {
  company: string
  location: string
  period: string
  title: string
  focus?: string
  tags: string[]
  groups: { heading?: string; bullets: string[] }[]
}

export const roles: Role[] = [
  {
    company: 'Neolab',
    tags: ['Azure', 'Container Apps', 'SQL Server', 'Grafana', 'Prometheus', 'Loki', 'Alloy', 'k6', 'Claude Code'],
    location: 'Santiago, Chile',
    period: '2025 — Present',
    title: 'Tech Lead',
    focus: 'Shipyard ERP modernization · cloud, data and network architecture for clients',
    groups: [
      {
        heading: 'Architecture',
        bullets: [
          'Took a stalled, business-critical ERP from paralysis to production in all environments within 3 months by leading the migration of legacy Delphi/SQL Server systems to a cloud-native platform on Azure, while removing development blockers and improving day-to-day developer experience.',
          'Simplified and extended the platform by consolidating microservices into one with a reversible, flag-driven cutover, integrating external ERP services, and rebuilding the inventory feature, verified against the legacy system.',
          'Designed the end-to-end architecture for a banking reconciliation platform processing 12M transactions per night: a fully cloud-native solution with an Azure lakehouse, an MLOps loop and a fully private network.',
        ],
      },
      {
        heading: 'Leadership',
        bullets: [
          'Grew developers into owners of critical parts of the system by delegating end-to-end ownership instead of keeping it centralized: the authentication and authorization flow, the full suppliers portal, and infrastructure operations with Grafana and Linux server management.',
          'Coached each owner hands-on wherever their work crossed into infrastructure, from Azure Container Apps networking, isolation and TLS for the suppliers portal to Grafana dashboards and Linux diagnostics, so that owning an area never meant working alone.',
          'Raised the team’s engineering standard with AI by designing a Claude Code skills pipeline (architecture, specs, TDD, adversarial review), authored ISO 27001 IT documentation, and wrote technical proposals for new clients.',
        ],
      },
      {
        heading: 'Performance',
        bullets: [
          'Made the slowest business-critical queries up to 40× faster and removed the main source of production deadlocks by rewriting legacy row-by-row SQL as set-based queries, tuning execution plans and adding fail-fast lock and query timeouts.',
          'Validated capacity for 20× the current user load with zero errors by designing k6 load tests against explicit latency SLAs.',
        ],
      },
      {
        heading: 'Infrastructure & Observability',
        bullets: [
          'Gave the team full production visibility by building a monitoring stack as code (Grafana, Prometheus, Loki, Alloy) with dashboards and alerting for every service, and used it with Linux server analysis to root-cause production incidents.',
          'Made delivery safer and faster by introducing DORA metrics, image promotion with one-click rollback, managed secrets on Azure and zero-downtime deployments, simplifying the release path and roughly halving test-suite times.',
        ],
      },
    ],
  },
  {
    company: 'Mercado Mayorista Lo Valledor',
    tags: ['Grafana', 'Prometheus', 'Go', 'Docker'],
    location: 'Santiago, Chile',
    period: '2023 — 2025',
    title: 'Senior Software Engineer',
    groups: [
      {
        bullets: [
          'Cut ticketing response times from 150 to 5 minutes and infrastructure costs by CLP 5M/month by re-architecting and replacing the legacy ticketing system.',
          'Brought incident detection on critical infrastructure under 1 minute, with the GPS location of each failure, by building a Grafana/Prometheus monitoring engine and a lightweight Go app for non-technical maintenance crews, with alerts via Teams, email and WhatsApp.',
          'Turned a platform users called “hard to use” into an intuitive daily tool by redesigning its core workflows around user feedback.',
        ],
      },
    ],
  },
  {
    company: 'Zapping',
    tags: ['CI/CD', 'Prometheus', 'Loki', 'Grafana', '2FA'],
    location: 'Santiago, Chile',
    period: '2022 — 2023',
    title: 'Software Engineer',
    groups: [
      {
        bullets: [
          'Enabled reliable, repeatable releases for high-traffic streaming applications by building CI/CD pipelines for multiple high-concurrency services, with one-click rollbacks and zero-downtime deployments.',
          'Gave every microservice end-to-end visibility by integrating Prometheus, Loki and Grafana into the core architecture.',
          'Mitigated active security attacks by implementing 2FA and intelligent network-level blocking.',
        ],
      },
    ],
  },
  {
    company: 'Biwiser',
    tags: ['Microservices', 'Docker', 'Jenkins', 'CI/CD'],
    location: 'Santiago, Chile',
    period: '2021 — 2022',
    title: 'Junior Software Engineer',
    groups: [
      {
        bullets: [
          'Enabled real-time infrastructure alerting by implementing observability and monitoring across the platform.',
          'Led the design and implementation of a scalable microservices system with automated CI/CD, Docker and Jenkins.',
        ],
      },
    ],
  },
]

export const education = {
  school: 'Universidad Adolfo Ibáñez',
  location: 'Santiago, Chile',
  period: '2016 — 2021',
  degree: 'B.S. in Computer Science & Engineering (Ingeniería Civil Informática)',
  notes: ['Teaching Assistant: Networking Fundamentals, Advanced Networking, Network Security.'],
}

export const certifications = [
  'AWS Certified Cloud Practitioner',
  'High-Concurrency Architectures',
  'Professional DevOps',
  'Docker, Terraform, Nginx',
]

export const languages = [
  { name: 'Spanish', level: 'Native' },
  { name: 'English', level: 'Advanced' },
]

export const interests = ['Culinary arts', 'History', 'Piano', 'Chess']
