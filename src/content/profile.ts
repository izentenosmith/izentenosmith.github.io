export const profile = {
  name: 'Ignacio Zenteno Smith',
  title: 'Senior Software Engineer',
  location: 'Santiago, Chile',
  email: 'i.zentenosmith@gmail.com',
  links: {
    github: 'https://github.com/izentenosmith',
    linkedin: 'https://www.linkedin.com/in/rodrigo-zenteno-smith',
  },
  tagline:
    'I design and run backend systems that stay up: architecture, databases, cloud infrastructure and the delivery pipelines around them.',
  summary:
    'Ten years building backends, with a focus on domain-driven design, high-concurrency systems and zero-downtime delivery. As a tech lead I grow engineers into owners of whole areas, speed up delivery, and build AI-assisted developer workflows for teams. I pick tools for the problem, not the other way around.',
  highlights: [
    { value: '40×', label: 'faster business-critical queries after rewriting row-by-row SQL as set-based' },
    { value: '20×', label: 'current user load validated with zero errors against explicit latency SLAs' },
    { value: '3 months', label: 'to take a stalled, business-critical ERP migration to production in every environment' },
    { value: '12M', label: 'transactions per night in a banking reconciliation platform I architected end to end' },
  ],
  skills: [
    { group: 'Languages', items: ['TypeScript', 'Go', 'Python', 'Bash'] },
    { group: 'Frameworks', items: ['NestJS', 'React', 'Django'] },
    { group: 'Data & MLOps', items: ['PostgreSQL', 'Redis', 'MLflow'] },
    {
      group: 'Cloud & DevOps',
      items: ['Azure', 'Azure DevOps', 'AWS', 'Docker', 'Terraform', 'Linux'],
    },
    {
      group: 'Networking',
      items: ['TCP/IP', 'DNS', 'TLS', 'VNet & CIDR design', 'Site-to-site VPN', 'Zero trust'],
    },
    {
      group: 'Observability & Testing',
      items: ['Grafana', 'Prometheus', 'Loki', 'Alloy', 'DORA metrics', 'Playwright', 'Vitest'],
    },
    { group: 'AI-assisted engineering', items: ['Skills', 'Multi-agent pipelines', 'Evals & harnesses'] },
  ],
} as const
