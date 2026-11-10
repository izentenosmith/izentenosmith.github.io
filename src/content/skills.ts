/**
 * The agent skills catalogue: what each skill does, the files in its folder,
 * what it draws on and how it scored. Descriptions only; the skill files
 * themselves are not published.
 */

export type SkillFile = { path: string; note: string }

/** Delta scores (0–1): assertions that test what the skill instructs, with it and without it. */
export type SkillEval = { name: string; checks: string; withSkill: number; baseline: number }

export type Skill = {
  name: string
  summary: string
  description: string
  modes?: string[]
  inspiredBy: string[]
  /** Companion files, besides the SKILL.md every skill has. */
  files: SkillFile[]
  evals: SkillEval[]
}

export type Family = {
  id: string
  name: string
  tagline: string
  description: string
  flow?: { label: string; steps: string[] }
  skills: Skill[]
}

const book = {
  cleanArchitecture: 'Clean Architecture — Robert C. Martin',
  cleanCode: 'Clean Code — Robert C. Martin',
  secureByDesign: 'Secure by Design — Dan Bergh Johnsson & Daniel Deogun',
  taossa: 'The Art of Software Security Assessment — Dowd, McDonald & Schuh',
  philosophy: 'A Philosophy of Software Design — John Ousterhout',
  refactoring: 'Refactoring, 2nd ed. — Martin Fowler',
  containerSecurity: 'Container Security, 2nd ed. — Liz Rice',
  dockerInAction: 'Docker in Action, 2nd ed. — Jeff Nickoloff & Stephen Kuenzli',
  dockerUpAndRunning: 'Docker: Up & Running, 2nd ed. — Sean Kane & Karl Matthias',
  dockerDeepDive: 'Docker Deep Dive — Nigel Poulton',
  dockerInPractice: 'Docker in Practice — Ian Miell & Aidan Hobson Sayers',
  sre: 'Site Reliability Engineering — Beyer, Jones, Petoff & Murphy',
  humanError: "The Field Guide to Understanding 'Human Error' — Sidney Dekker",
  storyMapping: 'User Story Mapping — Jeff Patton',
  workVisible: 'Making Work Visible — Dominica DeGrandis',
  codd: 'A Relational Model of Data for Large Shared Data Banks — E. F. Codd',
  thirdManifesto:
    'Databases, Types, and the Relational Model: The Third Manifesto — C. J. Date & Hugh Darwen',
  dbConcepts: 'Database System Concepts — Silberschatz, Korth & Sudarshan',
  dbManagement: 'Database Management Systems — Ramakrishnan & Gehrke',
  barker: 'CASE*Method: Entity Relationship Modelling — Richard Barker',
  sqlAntipatterns: 'SQL Antipatterns — Bill Karwin',
  sqlPerformance: 'SQL Performance Explained — Markus Winand',
  artOfSql: 'The Art of SQL — Stéphane Faroult',
  ddia: 'Designing Data-Intensive Applications — Martin Kleppmann',
  dbInternals: 'Database Internals — Alex Petrov',
  kurose: 'Computer Networking: A Top-Down Approach — Kurose & Ross',
  tanenbaum: 'Computer Networks — Tanenbaum & Wetherall',
  newman: 'Networks — M. E. J. Newman',
  barabasi: 'Network Science — Albert-László Barabási',
  continuousDelivery: 'Continuous Delivery — Jez Humble & David Farley',
  devopsHandbook: 'The DevOps Handbook — Kim, Humble, Debois & Willis',
  iac: 'Infrastructure as Code — Kief Morris',
  terraformBook: 'The Terraform Book — James Turnbull',
  awsTerraform: 'Best practices for using the Terraform AWS Provider — AWS Prescriptive Guidance',
  securityEngineering: 'Security Engineering, 3rd ed. — Ross Anderson',
  owaspDotnet: 'OWASP Top 10 for .NET developers — Troy Hunt',
  tangledWeb: 'The Tangled Web — Michal Zalewski',
  webSecurity: 'Web Security for Developers — Malcolm McDonald',
  hackingApis: 'Hacking APIs — Corey Ball',
  lpiSecurity: 'Security Essentials learning materials — Linux Professional Institute',
  rankin: 'Linux Hardening in Hostile Networks — Kyle Rankin',
  hardeningLinux: 'Hardening Linux — James Turnbull',
  linuxCookbook: 'Practical Linux Security Cookbook — Tajinder Kalsi',
  linuxFundamentals: 'Linux Security Fundamentals — David Clinton',
  bestKeptSecrets: 'Best Kept Secrets of Peer Code Review — Jason Cohen et al.',
  xrays: 'Software Design X-Rays — Adam Tornhill',
  owaspReview: 'Code Review Guide v2 — OWASP',
  agenticReview: 'Rethinking Code Review in the Age of AI — Kamalı, Tuna, Haratian & Tüzün',
}

// Docs that several skills carry their own copy of, so each folder works alone.
const shared = {
  dbTheory: {
    path: 'theory.md',
    note: 'Relational foundations every finding cites: relations, keys and dependencies, normal forms, NULLs, isolation anomalies, constraints.',
  },
  erModeling: {
    path: 'er-modeling.md',
    note: 'The modelling standard: entities, relationships, subtypes, arcs and history in Barker notation, with drills that check a model.',
  },
  physicalDesign: {
    path: 'physical-design.md',
    note: 'How a model becomes PostgreSQL DDL: keys, naming, integrity, types, indexes and access design.',
  },
  netTheory: {
    path: 'theory.md',
    note: 'The networking principles behind the rubrics, design patterns and proposals.',
  },
  graphTheory: {
    path: 'graph-theory.md',
    note: 'The network-science lens: articulation points, connectivity, betweenness and robustness.',
  },
  topologyModeling: {
    path: 'topology-modeling.md',
    note: 'The shared topology model every stage reads or writes, and how to recover it from evidence.',
  },
  diagramConventions: {
    path: 'diagram-conventions.md',
    note: 'The canonical network views: glyphs, identifiers and the validation each diagram must pass.',
  },
  netDesignPatterns: {
    path: 'design-patterns.md',
    note: 'Topology patterns, the addressing method, segmentation, routing and failure domains.',
  },
  netgraph: {
    path: 'scripts/netgraph.py',
    note: 'A standard-library script that computes the graph metrics and the address, flow and diagram checks.',
  },
} satisfies Record<string, SkillFile>

const scoring = (subject: string): SkillFile => ({
  path: 'scoring.md',
  note: `How ${subject} is graded: severity, confidence, the 0–10 formula, the gate and the report templates.`,
})

export const families: Family[] = [
  {
    id: 'development',
    name: 'Development',
    tagline: 'A seven-stage pipeline from a vague idea to reviewed, tested code.',
    description:
      'Design, specify, write the finish line, build, clean up, then an adversarial close. The last three stages form a loop: a no-go verdict sends remediation slices back through the build until the teardown finds nothing new. Two working files — a brief and a ledger — let each stage check the one before it.',
    flow: {
      label: 'Stages',
      steps: [
        'architect-deep-dive',
        'agent-brief',
        'acceptance-tests',
        'tdd',
        'refactor-review',
        'devils-advocate',
        'tyr-verdict',
      ],
    },
    skills: [
      {
        name: 'architect-deep-dive',
        summary: 'Resolves a design one question at a time, before any plan or code.',
        description:
          'A staff-architect design review. It states a charter, then works through the open questions one by one: the live options with their trade-offs, a recommendation and what it would cost to reverse. Where the codebase already answers a question, it infers the answer instead of asking.',
        inspiredBy: [book.cleanArchitecture, book.secureByDesign, book.taossa],
        files: [
          {
            path: 'clean-architecture.md',
            note: 'Dependency direction, policy versus detail, and where boundaries go.',
          },
          { path: 'records.md', note: 'The decision records and glossary entries a design leaves behind.' },
          {
            path: 'security.md',
            note: 'The security questions asked inside the design dialogue when a change crosses a trust boundary.',
          },
        ],
        evals: [
          {
            name: 'Charter and options',
            checks:
              'Opens with a charter and asks exactly one question, with an options table, a recommendation that names its own cost, and what would change its mind.',
            withSkill: 1,
            baseline: 0,
          },
        ],
      },
      {
        name: 'agent-brief',
        summary: 'Turns resolved decisions into the build plan the next stages execute.',
        description:
          'Writes the plain-text plan test-driven development works from: ordered acceptance criteria with the thinnest end-to-end slice first, the interfaces involved, test seams, prior art in the codebase, and what is deferred or out of scope.',
        inspiredBy: [],
        files: [],
        evals: [
          {
            name: 'Ordered criteria',
            checks:
              'Writes a plan with ordered acceptance criteria, named interfaces, marked edge cases, prior art pointing at real tests, and explicit scope.',
            withSkill: 1,
            baseline: 0,
          },
        ],
      },
      {
        name: 'acceptance-tests',
        summary: 'Writes the finish line as executable black-box tests, before any code.',
        description:
          "Turns the brief's acceptance criteria into tests through the system's outermost public boundary. Each test is written before the implementation and must fail for the right reason. It records which test proves which criterion; the build is done when they pass.",
        inspiredBy: [],
        files: [],
        evals: [
          {
            name: 'Red for the right reason',
            checks:
              'One black-box test per criterion, each failing on behaviour rather than a load error. The grader runs the tests against three mutants.',
            withSkill: 0.94,
            baseline: 0.25,
          },
        ],
      },
      {
        name: 'tdd',
        summary: 'Red, green, refactor — in vertical slices.',
        description:
          'Test-driven development as a loop: one failing test, the code that makes it pass, then the next. It executes the brief when there is one and works standalone when there is not, ticking each criterion against the test that proves it.',
        inspiredBy: [book.philosophy, book.secureByDesign],
        files: [
          { path: 'good-tests.md', note: 'Good and bad tests, side by side.' },
          { path: 'mocking.md', note: 'When to mock, and how.' },
          {
            path: 'deep-modules.md',
            note: 'The deep-module principle: a small interface over a large implementation.',
          },
          { path: 'interface-design.md', note: 'Designing interfaces that can be tested.' },
          {
            path: 'domain-primitives.md',
            note: 'Building security-relevant values — ids, amounts, paths — as types, test-first.',
          },
        ],
        evals: [
          {
            name: 'Reads the brief, builds vertically',
            checks:
              'Executes the plan instead of re-planning, records each cycle’s failing run, and ticks every criterion against the test that verifies it.',
            withSkill: 1,
            baseline: 0,
          },
        ],
      },
      {
        name: 'refactor-review',
        summary: 'Names the smell, then prescribes a behaviour-preserving refactoring.',
        description:
          'Reviews the current diff for the smells a green test bar does not catch. Each one is named and paired with a refactoring that keeps behaviour unchanged. Smells that are not worth fixing yet are carried forward with the condition that would promote them.',
        inspiredBy: [book.refactoring, book.secureByDesign, book.taossa],
        files: [
          {
            path: 'code-smells.md',
            note: 'The symptom catalogue: each smell, why it hurts, and its treatment.',
          },
          {
            path: 'refactoring-techniques.md',
            note: 'The treatment catalogue: refactorings with a known before and after.',
          },
          { path: 'comments.md', note: 'Which comments earn their place.' },
        ],
        evals: [
          {
            name: 'Promotes a noted smell',
            checks:
              'Re-reads the smells carried from earlier passes, promotes the one whose condition has fired, leaves the other, and keeps the suite green.',
            withSkill: 1,
            baseline: 0.12,
          },
        ],
      },
      {
        name: 'devils-advocate',
        summary: 'Assumes everything just built is wrong and looks for proof.',
        description:
          'An adversarial teardown of the diff. It hunts concrete evidence for each suspected defect, tries to falsify passing tests and looks for unhandled edges. It over-reports on purpose, and it neither fixes nor judges.',
        inspiredBy: [book.taossa],
        files: [],
        evals: [
          {
            name: 'Finds the vacuous test',
            checks:
              'Finds the rule that ignores its configuration and the test that passes without proving it, without re-reporting a claim already refuted.',
            withSkill: 1,
            baseline: 0.2,
          },
        ],
      },
      {
        name: 'tyr-verdict',
        summary: 'Adjudicates the teardown and issues a go or no-go.',
        description:
          'Weighs each finding against its evidence — confirmed, refuted or inconclusive — and cuts the false claims. Confirmed defects become remediation slices that start with a failing test, and the merge verdict follows from what is still open.',
        inspiredBy: [book.taossa],
        files: [],
        evals: [
          {
            name: 'Cuts and slices',
            checks:
              'Gives one verdict per finding, names the evidence that would settle an inconclusive one, orders the remediation by severity and returns no-go.',
            withSkill: 1,
            baseline: 0.33,
          },
        ],
      },
    ],
  },
  {
    id: 'containers',
    name: 'Containers',
    tagline: 'An image, the stack around it, and a review of how it runs.',
    description:
      'An ordered pair — the image first, because a compose file cannot repair one — plus three skills for containers once they are running: hardening them, debugging them and reviewing the Swarm around them.',
    flow: { label: 'Order', steps: ['dockerfile', 'docker-compose'] },
    skills: [
      {
        name: 'dockerfile',
        summary: 'Writes or repairs a production Dockerfile, verified by building it.',
        description:
          'Reads the stack off the repository and writes a multi-stage Dockerfile: pinned base image, non-root runtime, layers ordered for the build cache. It also writes or repairs the ignore file that defines the build context, and verifies by building and running rather than by reading.',
        inspiredBy: [
          book.containerSecurity,
          book.dockerInAction,
          book.dockerUpAndRunning,
          book.dockerDeepDive,
        ],
        files: [
          {
            path: 'optimization.md',
            note: 'Base-image trade-offs, layer order, cache mounts, secrets and signal handling.',
          },
          {
            path: 'dockerignore.md',
            note: 'What to keep out of the build context, and what each exclusion buys.',
          },
        ],
        evals: [
          {
            name: 'Repair pins and drops root',
            checks:
              'States what it inferred about the stack, names the existing file’s defects before changing it, and removes a secret baked into the image.',
            withSkill: 1,
            baseline: 0.45,
          },
        ],
      },
      {
        name: 'docker-compose',
        summary: 'Composes the services the code actually connects to.',
        description:
          'Detects dependencies from the source rather than from framework habit, then wires them with named volumes, an isolated network and real health gates. It ships a documented environment example and a development override, and verifies from a cold start, twice.',
        inspiredBy: [book.dockerInAction, book.dockerUpAndRunning],
        files: [
          {
            path: 'service-catalog.md',
            note: 'Per service: image, readiness probe, volume path and connection string.',
          },
          {
            path: 'environments.md',
            note: 'Overrides and merge rules, the documented environment example, and secrets.',
          },
        ],
        evals: [
          {
            name: 'Detects the real services',
            checks:
              'Composes the three services the code uses and leaves out the one a stale environment variable points at; health-gates startup and the migration step.',
            withSkill: 1,
            baseline: 0.44,
          },
        ],
      },
      {
        name: 'container-hardening',
        summary: 'Scores how containers run, and the image supply chain behind them.',
        description:
          'Reviews containers on Compose, Kubernetes, Swarm or plain Docker: privileged mode, the Docker socket, host namespaces, root, capabilities, read-only filesystems, limits, exposed ports, secrets and scanning. It returns a 0–10 score and a gate; in Harden mode it applies the fixes and proves the workload still runs.',
        modes: ['Review', 'Harden'],
        inspiredBy: [
          book.containerSecurity,
          book.dockerInAction,
          book.dockerUpAndRunning,
          book.dockerDeepDive,
        ],
        files: [
          { path: 'theory.md', note: 'The principles every finding cites.' },
          {
            path: 'controls.md',
            note: 'Per domain: each anti-pattern’s what, why, detection, fix, cost and severity.',
          },
          { path: 'platforms.md', note: 'How each control looks on Docker, Compose, Kubernetes and Swarm.' },
          scoring('a hardening review'),
        ],
        evals: [
          {
            name: 'Socket and firewall',
            checks:
              'Finds the privileged worker, the mounted Docker socket, a database published past the host firewall and a committed key — without echoing the key.',
            withSkill: 1,
            baseline: 0.57,
          },
        ],
      },
      {
        name: 'container-debug',
        summary: "Diagnoses a container that won't start, stay up or connect.",
        description:
          'Captures the evidence before anything destroys it, reads the runtime’s own record — exit code, out-of-memory kills, restart count, health log — and matches the symptom to container-specific failure modes. It proves one hypothesis at a time and routes the fix to the skill that owns it. Read-only in production.',
        inspiredBy: [
          book.dockerUpAndRunning,
          book.dockerInAction,
          book.dockerDeepDive,
          book.containerSecurity,
          book.dockerInPractice,
        ],
        files: [
          {
            path: 'symptoms.md',
            note: 'Exit codes and symptoms, with the causes behind each and the probe that tells them apart.',
          },
          { path: 'toolkit.md', note: 'Read-only commands per platform, and how to keep the evidence.' },
        ],
        evals: [
          {
            name: 'Three symptoms, three causes',
            checks:
              'Traces an out-of-memory kill, a service addressed as localhost and a script with the wrong line endings — each with evidence and a fix proven by the probe that found it.',
            withSkill: 1,
            baseline: 0.58,
          },
        ],
      },
      {
        name: 'docker-swarm',
        summary: 'Reviews or designs a Swarm cluster and its stack files.',
        description:
          'Covers quorum and manager count, backups, rolling-update and rollback settings, health checks as the rollout gate, stateful services on node-local volumes, overlay networks, secrets and placement — and the Compose keys a stack deploy silently ignores. It says first whether Swarm is still the right tool. Read-only: it never deploys or scales.',
        modes: ['Review', 'Design'],
        inspiredBy: [book.dockerDeepDive, book.dockerUpAndRunning, book.dockerInAction],
        files: [
          {
            path: 'theory.md',
            note: 'The principles every finding cites: desired state, quorum, rolling updates, node-local state, the routing mesh.',
          },
          {
            path: 'controls.md',
            note: 'Seven domains: what good looks like, the anti-patterns and the scored checklists.',
          },
          {
            path: 'runbook.md',
            note: 'Read-only evidence commands, failure modes with their recovery, and drills before go-live.',
          },
          scoring('a Swarm review'),
        ],
        evals: [
          {
            name: 'Quorum and state',
            checks:
              'Sees that two managers tolerate no failure, that a replicated database on local volumes is two diverging databases, and which Compose keys the deploy ignores.',
            withSkill: 1,
            baseline: 0.52,
          },
        ],
      },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    tagline: 'Living with a system once it is running.',
    description:
      'Fixing it when it breaks, recording what happened, telling people what changed and keeping the tracker honest. A hotfix escalates to an incident, which hands its log to the post-mortem; release notes stand alone; the ticket and backlog skills write and shape the work items for everything else.',
    flow: { label: 'Response chain', steps: ['hotfix', 'incident-fix', 'post-mortem'] },
    skills: [
      {
        name: 'hotfix',
        summary: 'A fast lane for an urgent bug in a system that is still up.',
        description:
          'Discovers the repository’s own commands and conventions, routes outages and design questions out of the lane, and proves the bug with a failing test. It fixes once, at the shared cause, runs one adversarial pass — strict on data, money, permissions and tenancy — and ships with recorded evidence.',
        inspiredBy: [book.sre],
        files: [
          {
            path: 'discovery.md',
            note: 'Learning the repository’s commands and conventions before touching it.',
          },
          {
            path: 'diagnosis.md',
            note: 'A failing loop before any theory: minimise, rank hypotheses, one probe at a time.',
          },
          { path: 'root-cause-note.md', note: 'The three-line note written before the fix.' },
          { path: 'review-checklist.md', note: 'The single adversarial pass over the diff.' },
          { path: 'follow-up.md', note: 'What a band-aid owes: a dated, findable follow-up item.' },
          { path: 'final-checklist.md', note: 'The record that closes the lane.' },
        ],
        evals: [
          {
            name: 'Shared cause in a Node service',
            checks:
              'Fixes the rounding bug in the shared helper rather than the reported caller, finds the inline duplicate and runs the suite the way CI does.',
            withSkill: 1,
            baseline: 0.38,
          },
          {
            name: 'Both callers in a JVM service',
            checks:
              'Fixes the shared pagination cause, names the second caller, and follows the repository’s own test script and merge convention.',
            withSkill: 1,
            baseline: 0.71,
          },
          {
            name: 'A script with no tests',
            checks:
              'Says plainly that there are no tests, writes the smallest check that fails before and passes after, and files a follow-up for a real harness.',
            withSkill: 1,
            baseline: 0.2,
          },
          {
            name: 'Routes an outage out',
            checks: 'Recognises the system is down, hands over to the incident skill and changes no file.',
            withSkill: 1,
            baseline: 0,
          },
        ],
      },
      {
        name: 'incident-fix',
        summary: 'Production incidents end to end: contain, diagnose, fix, learn.',
        description:
          'Contains first, with ranked and reversible levers. Diagnoses read-only and sizes the impact with a reproducible count. Fixes through the review pipeline with data repair as its own artefact, then writes the record and the follow-through, where every factor is owned or explicitly accepted. Every production action waits for confirmation.',
        inspiredBy: [book.sre],
        files: [
          { path: 'severity.md', note: 'Is this an incident, and how bad.' },
          {
            path: 'roles.md',
            note: 'Commander, operations, communications and planning, scaled to a small team.',
          },
          {
            path: 'containment-levers.md',
            note: 'Ranked levers, overload and cascading-failure responses, and the stepped ramp back.',
          },
          { path: 'discovery.md', note: 'Learning the repository’s levers, observability and data access.' },
          { path: 'diagnosis.md', note: 'What to do when the cause is not in plain sight.' },
          { path: 'phase-gates.md', note: 'The gate that closes each phase before the next begins.' },
          { path: 'incident-log.md', note: 'The append-only log every phase writes to.' },
          {
            path: 'data-repair.md',
            note: 'Repairing what the bug already wrote, as a separately reviewed artefact.',
          },
          { path: 'follow-through.md', note: 'Turning contributing factors into owned work.' },
          {
            path: 'postmortem-fallback.md',
            note: 'A compact record template for when the post-mortem skill is not installed.',
          },
        ],
        evals: [
          {
            name: 'Web app: contain by flag',
            checks:
              'Ranks the feature flag ahead of a rollback, takes no production action without confirmation — the levers are stubs that record every call — and dates the impact from the logs, not the alert.',
            withSkill: 1,
            baseline: 0.43,
          },
          {
            name: 'Batch job: repair as an artefact',
            checks:
              'Leaves production data untouched, counts the affected rows with a reproducible query, and writes a separate repair that defaults to a dry run and backs itself up.',
            withSkill: 1,
            baseline: 0.6,
          },
          {
            name: 'Library with no deploy',
            checks:
              'Adapts containment to a library — withdraw the release, advise a pin — and gives consumers repair guidance instead of repairing their data.',
            withSkill: 1,
            baseline: 0.71,
          },
        ],
      },
      {
        name: 'post-mortem',
        summary: 'Reconstructs a resolved incident into a blameless record.',
        description:
          'Builds a sourced timeline from a git date range plus incident documents, quantifies the impact, and names contributing factors rather than a single root cause. It documents and does not prescribe, ends with a pass over the prose for blame that leaks in through grammar, and is reviewed before publishing.',
        inspiredBy: [book.sre, book.humanError],
        files: [
          { path: 'blameless-culture.md', note: 'Why blameless is a data-collection strategy.' },
          {
            path: 'contributing-factors.md',
            note: 'Past a single root cause: the categories to sweep and where to stop.',
          },
          {
            path: 'evidence-sources.md',
            note: 'Reading a git range, incident documents, chat exports and monitoring into a sourced timeline.',
          },
          {
            path: 'template.md',
            note: 'The document’s sections and the metadata that makes incidents countable.',
          },
          { path: 'review-checklist.md', note: 'The review before publishing.' },
        ],
        evals: [
          {
            name: 'Widens the range and describes',
            checks:
              'Finds a triggering commit nine days before the outage, records contradicting sources instead of resolving them silently, and proposes no remediation.',
            withSkill: 1,
            baseline: 0.7,
          },
        ],
      },
      {
        name: 'release-notes',
        summary: 'Translates what was built into what the reader can now do.',
        description:
          'Reads the change set from git and classifies every change, with an explicit drop bucket for anything that has no user-visible effect. Each survivor is rewritten as an outcome. Depth is matched to scope, and breaking changes go above the fold.',
        inspiredBy: ['Keep a Changelog — the changelog convention'],
        files: [
          {
            path: 'anatomy.md',
            note: 'The six elements of a release note and the commit-to-outcome translation rules.',
          },
          {
            path: 'distribution.md',
            note: 'Depth matched to scope, when visuals help, and where to publish.',
          },
        ],
        evals: [
          {
            name: 'Translates, drops, leads with breaking',
            checks:
              'Confirms the range, spots a breaking change hidden in a one-line chore and puts it first with what to do about it.',
            withSkill: 1,
            baseline: 0.54,
          },
        ],
      },
      {
        name: 'ticket',
        summary: 'Creates, updates and closes work items in the team’s tracker.',
        description:
          'Works with Linear, Azure DevOps or Jira — or a markdown log when there is no tracker — through one adapter per tool. It discovers types, states, required fields and labels at runtime, reconciles against existing items before creating any, confirms the change set and reads every write back.',
        inspiredBy: [book.storyMapping, book.workVisible, book.sre],
        files: [
          { path: 'adapters/azure-devops.md', note: 'The Azure DevOps adapter.' },
          { path: 'adapters/jira.md', note: 'The Jira adapter.' },
          { path: 'adapters/linear.md', note: 'The Linear adapter.' },
          { path: 'adapters/local.md', note: 'A markdown log, for when there is no tracker.' },
          {
            path: 'profile.md',
            note: 'The project profile — types, states, required fields — and where each value is discovered.',
          },
          { path: 'writing.md', note: 'Writing the item: title, description and acceptance criteria.' },
          {
            path: 'labels.md',
            note: 'The canonical label set, including the production-incident labels delivery metrics are built from.',
          },
          {
            path: 'traceability.md',
            note: 'Linking items to commits and pull requests, and logging honest hours.',
          },
        ],
        evals: [
          {
            name: 'Reconciles before filing',
            checks:
              'With no tracker access, checks each finding against an export first: skips what is done, comments on the open duplicate, drafts only what is new and leaves a pending change set.',
            withSkill: 1,
            baseline: 0.71,
          },
        ],
      },
      {
        name: 'backlog',
        summary: 'Shapes, audits and orders a backlog.',
        description:
          'Builds story maps with release slices named for outcomes, refines work into thin stories with acceptance criteria, and runs a scored health check — oversized items, stale work, work in progress, overdue follow-ups. It orders by class of service and cost of delay. It only reads the tracker; every change goes through the ticket skill.',
        modes: ['Map', 'Refine', 'Health', 'Order'],
        inspiredBy: [book.storyMapping, book.workVisible, book.sre],
        files: [
          {
            path: 'theory.md',
            note: 'The principles every finding cites, from story mapping, flow and reliability.',
          },
          { path: 'story-map.md', note: 'Framing, backbone and body of a story map.' },
          { path: 'slicing.md', note: 'Release slices, each named for the outcome it reaches.' },
          { path: 'splitting.md', note: 'Breaking big stories into pieces that finish in days.' },
          { path: 'workshop.md', note: 'Preparing and recording the refinement conversation.' },
          { path: 'opportunity.md', note: 'Undecided ideas, kept apart from committed work.' },
          { path: 'flow.md', note: 'Work in progress, age and blocked work, read from the tracker.' },
          { path: 'health-checks.md', note: 'The health rubric, domain by domain.' },
          { path: 'ordering.md', note: 'One top priority, by class of service and cost of delay.' },
          scoring('a backlog health review'),
        ],
        evals: [
          {
            name: 'Health, then order by policy',
            checks:
              'Finds the overdue, unowned incident follow-up that caps the score, then orders the work by a stated policy — as a proposed change set, changing nothing.',
            withSkill: 1,
            baseline: 0.69,
          },
        ],
      },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    tagline: 'Architect, audit, design, diagram, propose, build and review queries.',
    description:
      'Seven independent skills. The audit does not prescribe, the design owns the model, the proposal assembles the recommendation, and DDL is generated only after the proposal is accepted. An architecture stage sits above them and a query review beside them.',
    flow: { label: 'Existing database', steps: ['dbaudit', 'dbdesign', 'dbdiagram', 'dbpropose', 'dbbuild'] },
    skills: [
      {
        name: 'dbarchitect',
        summary: 'Decides which data stores a system needs and how data flows between them.',
        description:
          'Names the system of record for each fact, the derived stores, replication, partitioning and the consistency each workflow needs — as decision records and a dataflow map. It can also review an existing architecture against the same rubric.',
        modes: ['Design', 'Review'],
        inspiredBy: [book.ddia, book.dbInternals],
        files: [
          {
            path: 'architecture-rubric.md',
            note: 'The rules a data architecture is built from and graded against.',
          },
          {
            path: 'store-selection.md',
            note: 'Trade-off tables for data models, engines, replication and partitioning.',
          },
          shared.dbTheory,
          shared.erModeling,
        ],
        evals: [
          {
            name: 'One system of record, no dual writes',
            checks:
              'Gives contested state a single system of record, demotes the cache to a derived store, replaces dual writes, and declines a new engine proposed without numbers.',
            withSkill: 1,
            baseline: 0.67,
          },
        ],
      },
      {
        name: 'dbaudit',
        summary: 'Audits an existing database with a repeatable 0–10 score.',
        description:
          'Reads the DDL or supplied structure and grades it against relational theory, modelling rules and a scored rubric. It reports strengths, weaknesses and improvement opportunities, each backed by evidence. It evaluates only; changes belong to the design and proposal skills.',
        inspiredBy: [book.codd, book.thirdManifesto, book.dbConcepts, book.sqlAntipatterns],
        files: [
          shared.dbTheory,
          shared.erModeling,
          scoring('an audit'),
          {
            path: 'audit-lenses.md',
            note: 'Cross-cutting lenses: dead and copied schemas, coupling, dark data, security.',
          },
          { path: 'tables.md', note: 'The rubric for tables.' },
          { path: 'indexes.md', note: 'The rubric for indexes.' },
          { path: 'views.md', note: 'The rubric for views.' },
          { path: 'procedures.md', note: 'The rubric for stored procedures.' },
          { path: 'triggers.md', note: 'The rubric for triggers.' },
          {
            path: 'detection-signals.md',
            note: 'A reproducible search for each anti-pattern, with engine notes.',
          },
        ],
        evals: [
          {
            name: 'Scored, not fixed',
            checks:
              'Audits a schema dump: a trigger that silently handles one row of many rated Critical, missing keys, money stored as floating point — every finding with a line that exists, and nothing changed.',
            withSkill: 0.95,
            baseline: 0.43,
          },
        ],
      },
      {
        name: 'dbdesign',
        summary: 'Designs a new database, or revises an audited one.',
        description:
          'Works from requirements, a domain model or an audit, using relational theory, normal forms and physical-design guidance. It keeps assumptions and open questions apart and owns the target model the later stages draw and propose.',
        inspiredBy: [book.codd, book.thirdManifesto, book.dbManagement, book.barker],
        files: [
          shared.dbTheory,
          shared.erModeling,
          shared.physicalDesign,
          {
            path: 'requirements.md',
            note: 'The requirements dossier: rule catalogue, data dictionary and access matrix.',
          },
        ],
        evals: [
          {
            name: 'From requirements, with traps',
            checks:
              'The DDL is executed and probed with rows that must be refused: an intersection table instead of a list column, price history by date, a birth date instead of an age.',
            withSkill: 0.97,
            baseline: 0.46,
          },
        ],
      },
      {
        name: 'dbdiagram',
        summary: 'Draws editable entity-relationship and relational diagrams.',
        description:
          'Produces draw.io diagrams from a design or database structure: a conceptual model in Barker notation and a relational model in table-and-key notation, with semantic cell identifiers and inferred semantics labelled as such.',
        inspiredBy: [book.barker],
        files: [shared.dbTheory, shared.erModeling],
        evals: [
          {
            name: 'Barker and relational from a design',
            checks:
              'Every diagram cell is parsed: a three-way association drawn as an intersection entity, role names at both ends of each relationship, a notation legend.',
            withSkill: 1,
            baseline: 0.88,
          },
        ],
      },
      {
        name: 'dbpropose',
        summary: 'Assembles the recommendation from audit, design and diagrams.',
        description:
          'Turns the evidence into a decision register — reuse, refactor, rework or rebuild — and a sequenced migration plan in which every step carries its validation, rollback and blast radius.',
        inspiredBy: [book.sqlAntipatterns, book.ddia],
        files: [
          {
            path: 'proposal.md',
            note: 'The input contract, the verdicts, and the target-schema and remediation skeletons.',
          },
          shared.dbTheory,
          shared.erModeling,
          shared.physicalDesign,
        ],
        evals: [
          {
            name: 'Orphans before constraints',
            checks:
              'Resolves orphaned rows before declaring the foreign keys that would reject them, traces every decision to an audit finding and invents none.',
            withSkill: 0.97,
            baseline: 0.54,
          },
        ],
      },
      {
        name: 'dbbuild',
        summary: 'Generates reviewable DDL from an accepted proposal.',
        description:
          'Writes ordered DDL files from an explicitly accepted proposal and its design. It stops on an unaccepted proposal, mismatched inputs or an open structural decision, and never applies what it writes.',
        inspiredBy: [],
        files: [],
        evals: [
          {
            name: 'Executable DDL from an accepted proposal',
            checks:
              'The files run in one pass on an empty database and refuse bad rows; an undecided constraint is flagged rather than invented.',
            withSkill: 1,
            baseline: 0.78,
          },
        ],
      },
      {
        name: 'dbquery',
        summary: 'Reviews the SQL a system actually runs.',
        description:
          'Reads query text, execution plans and workload statistics for cost, wrong results, races and injection. Prescriptions are weighed against the whole workload rather than one statement, and the review ends in a 0–10 score.',
        inspiredBy: [book.sqlPerformance, book.artOfSql, book.sqlAntipatterns],
        files: [
          { path: 'query-rubric.md', note: 'The anti-patterns graded in statements, plans and workload.' },
          {
            path: 'plan-reading.md',
            note: 'Where each of four engines shows access paths, row estimates, joins and sorts.',
          },
          { path: 'detection-signals.md', note: 'A reproducible search for each anti-pattern.' },
          scoring('a query review'),
          shared.dbTheory,
          shared.erModeling,
        ],
        evals: [
          {
            name: 'Workload ranked, indexes weighed',
            checks:
              'Ranks statements by total time rather than by the slowest, finds the N+1 behind the top one and weighs each index against every query on the table.',
            withSkill: 1,
            baseline: 0.93,
          },
        ],
      },
    ],
  },
  {
    id: 'networking',
    name: 'Networking',
    tagline: 'Audit, design, diagram, propose and blueprint a network.',
    description:
      'Five independent skills that read and write one shared topology model. Two lenses carry the theory: computer networking, and network science — which makes "single point of failure" and "blast radius" computable. Each skill ships the script that computes them.',
    flow: {
      label: 'Existing network',
      steps: ['netaudit', 'netdesign', 'netdiagram', 'netpropose', 'netblueprint'],
    },
    skills: [
      {
        name: 'netaudit',
        summary: 'Audits an existing network with a repeatable score.',
        description:
          'Works from infrastructure code, device configurations, container networking and address plans. It recovers a topology model, computes its graph metrics and reports evidence-backed findings across addressing, segmentation, routing, services, resilience and security.',
        inspiredBy: [book.kurose, book.tanenbaum, book.newman, book.barabasi],
        files: [
          shared.netTheory,
          shared.graphTheory,
          shared.topologyModeling,
          scoring('an audit'),
          {
            path: 'audit-lenses.md',
            note: 'The cross-cutting lenses applied on top of the per-domain rubrics.',
          },
          {
            path: 'detection-signals.md',
            note: 'A search for each anti-pattern, with platform notes.',
          },
          { path: 'addressing.md', note: 'The rubric for addressing.' },
          { path: 'segmentation.md', note: 'The rubric for segmentation.' },
          { path: 'routing.md', note: 'The rubric for routing.' },
          { path: 'services.md', note: 'The rubric for network services.' },
          { path: 'resilience.md', note: 'The rubric for resilience.' },
          { path: 'security.md', note: 'The rubric for security.' },
          shared.netgraph,
        ],
        evals: [
          {
            name: 'Hub and spoke: recovers and scores',
            checks:
              'Recovers the topology, rates an internet-reachable remote-desktop rule Critical, finds overlapping address ranges and the single devices every critical path crosses — and never reproduces a secret.',
            withSkill: 1,
            baseline: 0.31,
          },
        ],
      },
      {
        name: 'netdesign',
        summary: 'Designs a new network, or revises an audited one.',
        description:
          'Decides zones and flows, the addressing plan, routing, services and failure domains, and returns the design with a target topology model that the graph script can measure.',
        inspiredBy: [book.kurose, book.tanenbaum, book.newman, book.barabasi],
        files: [
          shared.netDesignPatterns,
          shared.netTheory,
          shared.graphTheory,
          shared.topologyModeling,
          shared.netgraph,
        ],
        evals: [
          {
            name: 'Plans around what is in use',
            checks:
              'Every address range is parsed: no internal overlap, the ranges already in use avoided and written down, regulated data and management in their own zones, default-deny everywhere.',
            withSkill: 0.9,
            baseline: 0.3,
          },
        ],
      },
      {
        name: 'netdiagram',
        summary: 'Draws the canonical, editable network views.',
        description:
          'Produces draw.io views from the topology model — logical layer 3, segmentation with its allowed flows, and physical layers 1 and 2 when the network is on-premises — following one convention across every stage.',
        inspiredBy: [],
        files: [shared.diagramConventions, shared.topologyModeling, shared.netgraph],
        evals: [
          {
            name: 'Canonical views from the model',
            checks:
              'Every cell is parsed: each node drawn under its model identifier, each network labelled with its range, arrows exactly matching the allowed flows, no physical view invented for a cloud-only model.',
            withSkill: 1,
            baseline: 0.2,
          },
        ],
      },
      {
        name: 'netpropose',
        summary: 'Assembles the recommendation, with cut-over sequencing.',
        description:
          'Compares the audited network with the target design and writes a decision register plus a cut-over plan: containment first, every step with validation, rollback and blast radius, and connectivity stated before and after.',
        inspiredBy: [book.kurose, book.tanenbaum, book.newman, book.barabasi],
        files: [
          { path: 'proposal.md', note: 'Decisions by score band, and how to sequence a cut-over.' },
          shared.netDesignPatterns,
          shared.diagramConventions,
          shared.netTheory,
          shared.graphTheory,
          shared.topologyModeling,
          shared.netgraph,
        ],
        evals: [
          {
            name: 'Contains before restructuring',
            checks:
              'Contains the exposed segment in the first change window, sequences renumbering against what depends on it, and retires nothing before its usage is confirmed.',
            withSkill: 1,
            baseline: 0.7,
          },
        ],
      },
      {
        name: 'netblueprint',
        summary: 'Packages the accepted design for implementation.',
        description:
          'After a proposal is explicitly accepted, produces the final diagrams, a companion design document and the accepted topology model, as a handoff to whoever writes the infrastructure code. It writes none itself.',
        inspiredBy: [book.kurose, book.tanenbaum, book.newman, book.barabasi],
        files: [
          {
            path: 'blueprint.md',
            note: 'The package layout, the handoff contract and the design-document template.',
          },
          shared.diagramConventions,
          shared.netTheory,
          shared.graphTheory,
          shared.topologyModeling,
          shared.netgraph,
        ],
        evals: [
          {
            name: 'Waits for acceptance',
            checks:
              'Given a proposal nobody has accepted, it stops, asks for the acceptance record and produces nothing.',
            withSkill: 1,
            baseline: 0.75,
          },
        ],
      },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    tagline: 'Infrastructure code and the pipelines that ship it.',
    description:
      'Two skills with three modes each: Review returns findings, a 0–10 score and a gate; Design lays out the target; Propose sequences the migration. They meet at the apply path — one grades whether each root has a safe path to apply, the other designs it.',
    flow: { label: 'Modes', steps: ['Review', 'Design', 'Propose'] },
    skills: [
      {
        name: 'terraform',
        summary: 'Reviews, designs and migrates Terraform and OpenTofu codebases.',
        description:
          'Review recovers a state map and module graph and grades code, state, modules, versions, security and change safety. Design lays out state boundaries, module interfaces and environments. Propose sequences a migration in which no resource is recreated by accident. It never touches a real backend.',
        modes: ['Review', 'Design', 'Propose'],
        inspiredBy: [
          book.iac,
          book.terraformBook,
          book.awsTerraform,
          book.continuousDelivery,
          book.devopsHandbook,
          book.sre,
        ],
        files: [
          { path: 'theory.md', note: 'The principles every finding cites.' },
          {
            path: 'review-rubric.md',
            note: 'Six domains: what good looks like, the anti-patterns and the checklists.',
          },
          {
            path: 'detection-signals.md',
            note: 'A search for each anti-pattern across the major cloud providers.',
          },
          scoring('a review'),
          {
            path: 'design-patterns.md',
            note: 'Layouts, state boundaries, module interfaces and environment models.',
          },
          { path: 'proposal.md', note: 'The no-recreate rule, and the order a migration runs in.' },
        ],
        evals: [
          {
            name: 'Review: state and secrets',
            checks:
              'Finds committed credentials without echoing them, two environments sharing one state, and resources keyed in a way that risks replacement — changing nothing.',
            withSkill: 1,
            baseline: 0.57,
          },
          {
            name: 'Design: isolates state',
            checks:
              'Splits state by lifecycle and ownership, isolates the regulated workload, and declines a one-bucket request with a reason.',
            withSkill: 1,
            baseline: 0.71,
          },
          {
            name: 'Propose: nothing recreated',
            checks:
              'Rotates the leaked key before removing it, contains exposure before restructuring, and declares every address change with an expected plan of zero destroys.',
            withSkill: 1,
            baseline: 0.43,
          },
        ],
      },
      {
        name: 'pipelines',
        summary: 'Reviews, designs and migrates CI/CD pipelines.',
        description:
          'Review recovers the value stream from commit to production and grades flow, feedback, release safety, security and supply chain, environments and infrastructure delivery. Design lays out stage contracts and build-once promotion. Propose orders the changes so the path to production never goes down. It never triggers or approves a real run.',
        modes: ['Review', 'Design', 'Propose'],
        inspiredBy: [book.continuousDelivery, book.devopsHandbook, book.sre, book.iac],
        files: [
          { path: 'theory.md', note: 'The principles every finding cites.' },
          {
            path: 'review-rubric.md',
            note: 'Six domains: what good looks like, the anti-patterns and the checklists.',
          },
          {
            path: 'detection-signals.md',
            note: 'A search for each anti-pattern across the common CI systems.',
          },
          scoring('a review'),
          {
            path: 'design-patterns.md',
            note: 'The reference pipeline, release strategies, the security model and infrastructure delivery.',
          },
          { path: 'proposal.md', note: 'How to sequence changes while production keeps shipping.' },
        ],
        evals: [
          {
            name: 'Review: untrusted code and rebuilds',
            checks:
              'Finds a trigger that runs fork code with secrets, a script injection, a rebuild per environment and a deploy with no test gate.',
            withSkill: 1,
            baseline: 0.67,
          },
          {
            name: 'Design: build once, release progressively',
            checks:
              'Builds once and promotes the same artefact, releases by canary with automated rollback, and replaces an approval meeting with peer review.',
            withSkill: 1,
            baseline: 0.65,
          },
          {
            name: 'Propose: keeps production up',
            checks:
              'Runs the new pipeline alongside the old before cutting over, and names the settings a git revert would not undo.',
            withSkill: 0.93,
            baseline: 0.7,
          },
        ],
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    tagline: 'One skill per layer of defence.',
    description:
      'What to protect and from whom, whether the code enforces it, and whether the platform is locked down. Each skill has the same three modes — Review, Design, Propose — and every finding cites a numbered principle.',
    flow: { label: 'Modes', steps: ['Review', 'Design', 'Propose'] },
    skills: [
      {
        name: 'threatmodel',
        summary: "Reviews or builds a system's security design.",
        description:
          'System definition, assets, adversary classes, a data-flow diagram with trust boundaries, threats per boundary, a matrix that wants two independent mechanisms per serious hazard, a risk register with owners, and requirements traced to tests. Propose mode decides the risk treatment. It never attacks a live system.',
        modes: ['Review', 'Design', 'Propose'],
        inspiredBy: [book.securityEngineering, book.taossa, book.lpiSecurity],
        files: [
          { path: 'theory.md', note: 'The principles every finding cites.' },
          {
            path: 'review-rubric.md',
            note: 'Six domains: what good looks like, the anti-patterns and the checklists.',
          },
          { path: 'detection-signals.md', note: 'The signals to look for in design artefacts.' },
          scoring('a review'),
          {
            path: 'design-patterns.md',
            note: 'Data-flow diagrams, threat trees, and the adversary and access-control catalogues.',
          },
          { path: 'proposal.md', note: 'Risk treatment: eliminate, mitigate, transfer or accept.' },
        ],
        evals: [
          {
            name: 'Review: abuse and fallback',
            checks:
              'Finds a single approver for irreversible payouts, a permission that can grant itself and a fraud check that fails open.',
            withSkill: 1,
            baseline: 0.5,
          },
          {
            name: 'Design: abusers and traps',
            checks:
              'Models insiders and abusers as well as outsiders, and declines shortcuts such as treating a hashed identifier as privacy.',
            withSkill: 1,
            baseline: 0.77,
          },
          {
            name: 'Propose: contain, then design out',
            checks:
              'Contains the live risks before any redesign, and gives every acceptance an owner and an expiry.',
            withSkill: 1,
            baseline: 0.54,
          },
        ],
      },
      {
        name: 'appsec',
        summary: 'Reviews application code on any stack.',
        description:
          'Nine domains, from input handling to APIs and the browser trust boundary. Findings carry file-and-line evidence and map to the current OWASP Top 10 and API Top 10, with a score and a gate. Design mode sets a service’s controls; Propose mode orders remediation by risk. Static by default.',
        modes: ['Review', 'Design', 'Propose'],
        inspiredBy: [
          book.securityEngineering,
          book.owaspDotnet,
          book.tangledWeb,
          book.webSecurity,
          book.hackingApis,
          book.taossa,
        ],
        files: [
          { path: 'theory.md', note: 'The principles every finding cites.' },
          {
            path: 'review-rubric.md',
            note: 'Nine domains: what good looks like, the anti-patterns and the checklists.',
          },
          { path: 'detection-signals.md', note: 'A search for each anti-pattern, per stack.' },
          scoring('a review'),
          { path: 'design-patterns.md', note: 'Control patterns per stack.' },
          { path: 'proposal.md', note: 'Remediation in risk order.' },
        ],
        evals: [
          {
            name: 'Review: inventory and secrets',
            checks:
              'Reconciles the endpoints against the API specification and so finds an unauthenticated legacy version, alongside injection, broken object access and weak password hashing.',
            withSkill: 0.98,
            baseline: 0.61,
          },
          {
            name: 'Design: reshapes the quick wins',
            checks:
              'Declines the convenient options — tokens in browser storage, wildcard origins, tenant checks in the frontend — for controls enforced on the server.',
            withSkill: 1,
            baseline: 0.71,
          },
          {
            name: 'Propose: contain, then fix the class',
            checks:
              'Rotates the key and contains the open holes first, then fixes each class of defect once, starting from a failing test.',
            withSkill: 1,
            baseline: 0.57,
          },
        ],
      },
      {
        name: 'hardening',
        summary: 'Reviews hosts and cloud estates against a baseline.',
        description:
          'Distribution-agnostic and cloud-agnostic. Review recovers an asset register, an exposure map and a privilege map, with overlays per service role. Design writes the baseline: control identifiers, a level per tier and a read-only check for each. Propose plans a rollout in which no step locks out its own operators. It never changes a host or account.',
        modes: ['Review', 'Design', 'Propose'],
        inspiredBy: [
          book.securityEngineering,
          book.rankin,
          book.hardeningLinux,
          book.linuxCookbook,
          book.linuxFundamentals,
        ],
        files: [
          { path: 'theory.md', note: 'The principles every finding cites.' },
          {
            path: 'review-rubric.md',
            note: 'Eight domains: what good looks like, the anti-patterns and the checklists.',
          },
          {
            path: 'detection-signals.md',
            note: 'A read-only check for each control, per distribution and per cloud.',
          },
          scoring('a review'),
          {
            path: 'design-patterns.md',
            note: 'The baseline catalogue, with distribution and cloud mapping, naming, tagging and exceptions.',
          },
          { path: 'proposal.md', note: 'The rollout in which no step locks out its own operators.' },
        ],
        evals: [
          {
            name: 'Review: a mixed estate',
            checks:
              'Identifies two different distributions and reads each with its own tooling; finds remote login open to the internet, unrestricted privilege escalation and a backup never restored — with no active probe.',
            withSkill: 0.98,
            baseline: 0.68,
          },
          {
            name: 'Design: a tier-aware baseline',
            checks:
              'Holds sandboxes to a different level than production, maps each control per platform and declines obscurity presented as a control.',
            withSkill: 1,
            baseline: 0.6,
          },
          {
            name: 'Propose: no lockout',
            checks:
              'Brings a tested private admin path up before removing the public one, and gives every access-reducing step a lockout guard.',
            withSkill: 1,
            baseline: 0.69,
          },
        ],
      },
    ],
  },
  {
    id: 'review',
    name: 'Review',
    tagline: 'Judging a change as it arrives.',
    description:
      'Six skills around one pull request, branch or diff from anyone: preparation before review, what the history says, the review itself with two specialists, and a retrospective afterwards. A human always makes the final call.',
    flow: { label: 'Around one change', steps: ['pr-prep', 'code-xray', 'peer-review', 'review-retro'] },
    skills: [
      {
        name: 'pr-prep',
        summary: "The author's side of a review, and a readiness check before one.",
        description:
          'Author mode self-reviews against an omission checklist, checks size and shape, proposes a split and writes the description: the claim, how to verify it, the risk and a reading order. Readiness mode restates someone else’s claim, checks the diff against it and says whether the change is ready for review.',
        modes: ['Author', 'Readiness'],
        inspiredBy: [book.bestKeptSecrets, book.agenticReview, book.xrays, book.cleanCode],
        files: [
          {
            path: 'theory.md',
            note: 'The principles: author preparation, the claim, size and shape, omissions.',
          },
          {
            path: 'description-template.md',
            note: 'The pull request description template, with a filled example.',
          },
          {
            path: 'splitting.md',
            note: 'How to split or untangle a change, in which order, and when not to.',
          },
          { path: 'self-review.md', note: 'The author’s checklist, one item at a time.' },
        ],
        evals: [
          {
            name: 'Splits and discloses',
            checks:
              'On a branch mixing a refactor with a feature, compares its size to the limit and proposes a split — refactor first — without rewriting any history.',
            withSkill: 0.97,
            baseline: 0.31,
          },
        ],
      },
      {
        name: 'code-xray',
        summary: 'Behavioural code analysis from git history.',
        description:
          'A bundled read-only script computes hotspots, complexity trends, change coupling, clone twins, code age and knowledge maps. For a pull request it feeds the reviewer’s risk map; for a codebase it ranks refactoring targets by how often they change. It routes reviews and spots knowledge loss, and never rates people.',
        modes: ['PR', 'Codebase'],
        inspiredBy: [book.xrays],
        files: [
          { path: 'theory.md', note: 'The principles behind behavioural code analysis.' },
          {
            path: 'analyses.md',
            note: 'Each analysis: what it measures, how it is computed, thresholds and false readings.',
          },
          { path: 'report.md', note: 'The pull request signals block and the codebase report.' },
          {
            path: 'scripts/xray.py',
            note: 'A read-only, standard-library script that computes the analyses from git history.',
          },
        ],
        evals: [
          {
            name: 'Hotspots, not cold giants',
            checks:
              'Cleans the history first — a mass commit and a generated file dropped — then ranks by change frequency and narrows the top file to one function.',
            withSkill: 1,
            baseline: 0.4,
          },
        ],
      },
      {
        name: 'peer-review',
        summary: 'A senior-peer review of a change against its claim.',
        description:
          'Compares the change with what it claims to do, looks for what is missing — including the files history says should have changed together — and ranks attention by risk. Each candidate finding is verified before it is reported. Comments state problem, evidence and fix, and the report ends with a coverage statement and a recommendation a human makes.',
        inspiredBy: [book.bestKeptSecrets, book.xrays, book.owaspReview, book.cleanCode, book.agenticReview],
        files: [
          { path: 'theory.md', note: 'The principles every finding cites.' },
          {
            path: 'lenses.md',
            note: 'The sixteen finder lenses: what each looks for and what it tends to miss.',
          },
          {
            path: 'history-signals.md',
            note: 'Hotspots, change coupling, clone twins and knowledge maps, read from git history.',
          },
          { path: 'security-lens.md', note: 'The security pass every diff gets, and when to escalate.' },
          {
            path: 'heuristics.md',
            note: 'Code heuristics plus the concurrency, failure-path and test checklists.',
          },
          {
            path: 'comments.md',
            note: 'The shape of a finding: labels, the usefulness filter, handling pushback.',
          },
          {
            path: 'report.md',
            note: 'Severity, verdicts, the recommendation rule and the report templates.',
          },
        ],
        evals: [
          {
            name: 'Claim, omission, injection',
            checks:
              'Finds that half of the claimed behaviour is not implemented, flags an unclaimed change, and treats instructions planted in the change as data.',
            withSkill: 1,
            baseline: 0.29,
          },
        ],
      },
      {
        name: 'test-review',
        summary: 'Would each test fail if the behaviour broke?',
        description:
          'The specialist for the test lens. It traces every claim and acceptance criterion to its tests — covered, weak or missing — names a mutation for each changed branch and shows whether an assertion would catch it. A claim that a test cannot fail is confirmed by a mutation probe in a scratch copy.',
        inspiredBy: [book.cleanCode, book.bestKeptSecrets, book.xrays],
        files: [
          { path: 'theory.md', note: 'The principles: tests as evidence, and whether a test would fail.' },
          { path: 'checklist.md', note: 'The test-quality checks, in eight families.' },
          { path: 'mutation.md', note: 'The mutation probe that confirms a test cannot fail.' },
          { path: 'smells.md', note: 'Test smells: how to spot each, why it matters, the fix.' },
        ],
        evals: [
          {
            name: 'Would it fail?',
            checks:
              'Maps five acceptance criteria to their tests, shows a boundary mutation that survives, and names the criterion with no test at all.',
            withSkill: 1,
            baseline: 0.2,
          },
        ],
      },
      {
        name: 'concurrency-review',
        summary: 'Finds races, and shows each one as an interleaving.',
        description:
          'The specialist for the concurrency lens: shared state and lock scope, check-then-act, atomicity, deadlock, transactions and isolation, idempotency, at-least-once delivery and schedulers running on many instances. A finding is confirmed only by a reproduction, re-run, because one green run proves nothing.',
        inspiredBy: [book.cleanCode, book.bestKeptSecrets, book.owaspReview],
        files: [
          { path: 'theory.md', note: 'The principles: shared state, atomicity, deadlock and delivery.' },
          { path: 'checklist.md', note: 'The concurrency checks, one item at a time.' },
          { path: 'interleavings.md', note: 'The notation for an interleaving, with worked examples.' },
          { path: 'languages.md', note: 'Per-language traps, and the tools that settle a claim.' },
        ],
        evals: [
          {
            name: 'Interleavings and replicas',
            checks:
              'Reads the replica count from the deployment files outside the diff, and writes each race — such as a double redemption — as numbered steps.',
            withSkill: 1,
            baseline: 0.39,
          },
        ],
      },
      {
        name: 'review-retro',
        summary: 'What the reviews are teaching, measured by area — never by person.',
        description:
          'After a review it writes a retrievable record: decisions, outcomes and deferrals. Across many reviews it computes metrics by type, severity, lens and code area, and proposes checklist items, rules and lint rules for a person to approve. Nothing is applied.',
        modes: ['Record', 'Retro'],
        inspiredBy: [book.bestKeptSecrets, book.xrays, book.agenticReview],
        files: [
          { path: 'theory.md', note: 'The principles: records, measuring without rating people, improving.' },
          {
            path: 'metrics.md',
            note: 'Each metric: definition, formula, what it tells you, how it is gamed and its minimum sample.',
          },
          { path: 'record-template.md', note: 'The pull request record and retrospective report templates.' },
          {
            path: 'proposals.md',
            note: 'Turning recurring findings into checklist items and rules, with human approval.',
          },
        ],
        evals: [
          {
            name: 'Areas, not people',
            checks:
              'Declines a request to rank reviewers and offers the view by code area instead; every metric carries its numerator, denominator and sample floor.',
            withSkill: 1,
            baseline: 0.36,
          },
        ],
      },
    ],
  },
  {
    id: 'memory',
    name: 'Memory',
    tagline: 'What agents learn about a repository, kept in the repository.',
    description:
      'One skill with four modes. Memory is shared, reviewed like code and corrected by an offline consolidation pass. Stale is not wrong: an old note that still holds is kept. And memory is data, never authority — no change to it lands without review.',
    flow: { label: 'Lifecycle', steps: ['capture', 'dream', 'review'] },
    skills: [
      {
        name: 'repo-memory',
        summary: 'A shared, reviewable memory for coding agents, kept true by dreaming.',
        description:
          'Install scaffolds a four-layer hierarchy: git history as the transcript, one-fact notes, single-writer pages and a small index loaded into every session. Capture writes one note when something is clearly worth keeping. Dream re-verifies notes against the code since its last run — correcting, merging, deleting and promoting with evidence — and leaves the changes for a person to approve. Audit runs a bundled read-only linter.',
        modes: ['Install', 'Capture', 'Dream', 'Audit'],
        inspiredBy: [
          'The components of agent memory — Anthropic',
          'Memory tool documentation — Claude API',
          "Exploring Anthropic's Memory Tool — Leonie Monigatti",
          'Redesigning source control at Anthropic — Anthropic',
        ],
        files: [
          {
            path: 'theory.md',
            note: 'The principles: the memory hierarchy, dreaming, single writers, a small index, memory as data.',
          },
          {
            path: 'layout.md',
            note: 'The memory tree, note and page metadata, the index budget and what never goes in.',
          },
          {
            path: 'dreaming.md',
            note: 'The consolidation pass: its inputs, its six operations and the evidence each needs.',
          },
          { path: 'templates.md', note: 'Templates for the index, a note, a page and the dream report.' },
          { path: 'scripts/memlint.py', note: 'A read-only linter for the memory tree.' },
        ],
        evals: [
          {
            name: 'Dream: true and small',
            checks:
              'Corrects notes the code has overtaken, keeps an old note that still holds, merges a duplicate, strips a secret, and reports a planted instruction as data instead of obeying it.',
            withSkill: 1,
            baseline: 0.77,
          },
        ],
      },
    ],
  },
]

export type Harness = {
  name: string
  title: string
  runs: string
  how: string[]
  returns: string
  /** An end-to-end run of the harness itself: one run, no baseline. */
  evaluation?: Omit<SkillEval, 'baseline'>
}

export const harnesses: Harness[] = [
  {
    name: 'loop.py',
    title: 'The closing loop',
    runs: 'The last three development stages — refactor-review, devils-advocate, tyr-verdict — and the fix loop back through tdd.',
    how: [
      'The teardown fans out to three or more delegates in parallel. They are given no tool that can run anything, so "do not execute" is enforced rather than requested.',
      'Every finding gets one verifier, each in a throwaway copy of the repository. The verdict is made once, on the whole slate.',
      'The test suite is a gate before and after each stage. A remediation slice closes only when its new tests are proven to fail on the pre-fix code.',
      'The ledger is append-only and written only by the harness. Go, no-go or escalated is computed from it, capped at three iterations.',
      'The ledger is also the state: a stopped run resumes at the first stage it does not show as done.',
    ],
    returns: 'A ledger ending in go, no-go or escalated.',
    evaluation: {
      name: 'The loop closes the teardown',
      checks:
        'Run end to end on a seeded repository, it reaches a verdict and leaves a ledger that checks clean: the planted defect and the vacuous test are confirmed, the refuted claim stays refuted, and the fix lands through the public seam.',
      withSkill: 1,
    },
  },
  {
    name: 'fix.py',
    title: 'Bug report to pull request',
    runs: 'The hotfix lane, or the fix phase of an incident.',
    how: [
      'Seven gated stages: discover, triage, root cause, red, fix, review, ship.',
      'Root cause may change no file. Red may change only tests, and the test must fail on the unfixed code.',
      'The fix needs the suite and every discovered lint command green, plus the red-to-green proof against a snapshot of the pre-fix tree.',
      'One adversarial review pass: blockers are fixed once, the rest become follow-ups. An outage or a design question is routed out with nothing touched.',
      'Ships a branch with a commit of declared files only and, on request, a draft pull request. Nothing is ever merged or deployed.',
    ],
    returns: 'A committed branch and, optionally, a draft pull request.',
  },
  {
    name: 'postmortem.py',
    title: 'Resolved incident to post-mortem',
    runs: 'The record-and-learn phase that follows a resolved incident.',
    how: [
      'Writes nothing unless the incident log checks clean and is resolved.',
      'Opens the git range fourteen days before the earliest change or impact — the trigger is often older than the outage.',
      'Lints the record for counterfactuals, "human error", prescription, and any author’s name next to a failure word. One correction round, then it stops.',
      'Drafts the follow-through as proposed outcomes. Owners and dates are never invented, and closing waits until every factor is owned or accepted.',
    ],
    returns: 'A linted, blameless post-mortem and an owned follow-through.',
  },
  {
    name: 'dbworkflow.py',
    title: 'Database workflow',
    runs: 'The database skills in order: audit, design, diagram, propose, build.',
    how: [
      'An existing database starts with a read-only audit. A passing gate ends the workflow; an open one routes it into design, diagrams and proposal. A new database skips the audit.',
      'Checks in code that both diagrams exist and that the entity-relationship page is in the agreed notation with a visible legend.',
      'DDL is never built in the run that creates a proposal. A separate run requires the accepted proposal and the approved diagram pair.',
      'The build stage writes SQL files and never applies them.',
    ],
    returns: 'An audit gate, a design, both diagrams, a proposal and acceptance-gated DDL.',
  },
  {
    name: 'dbreview.py',
    title: 'Database audit and gate',
    runs: "dbaudit's read-only audit; usable on its own.",
    how: [
      'Acquisition is read-only: schema files, or a connection named by an environment variable and used only to dump the schema. The connection string appears in no log.',
      'One read-only audit agent per database reports, per criterion, how many objects satisfy it, plus findings with severity and confidence.',
      'The harness computes the score — not the model — with caps for open Critical and High findings, and writes the arithmetic into every evaluation.',
      'The gate passes at 9.0 or above with no open Critical or High finding and few unresolved needs-data flags.',
    ],
    returns: 'Scored audit files, a synthesis and a gate decision.',
  },
  {
    name: 'networkflow.py',
    title: 'Network workflow',
    runs: 'The networking skills in order: audit, design, diagram, propose, blueprint.',
    how: [
      'Same shape as the database workflow: audit and gate first for an existing network, straight to design for a new one.',
      'The design must return a valid target topology, which is graph-analysed before anything is drawn.',
      'Each diagram is validated in code: page names, a legend, every network labelled with its address range, every cell tied to the model, every zone drawn.',
      'The blueprint never shares a run with the proposal and requires explicit acceptance. No stage writes infrastructure code or touches a network.',
    ],
    returns:
      'An audit gate, a design with its target topology, the diagrams, a proposal and an acceptance-gated blueprint.',
  },
  {
    name: 'netreview.py',
    title: 'Network audit, graph and gate',
    runs: "netaudit's read-only audit, the graph analysis and the gate.",
    how: [
      'Evidence is files you name. Nothing connects to a device, controller or cloud API.',
      'Secrets are masked in a copy before any model reads it, with line numbers preserved. Each masked secret becomes a finding that names its kind, never its value.',
      'One read-only audit agent per network returns findings and the recovered topology.',
      'A script computes the structure: single points of failure, connectivity per critical pair, hub concentration, robustness under targeted removal, address overlaps and risky flows.',
      'The gate adds a structural condition to the score: every declared critical pair must survive the loss of any one node.',
    ],
    returns: 'Redacted evidence, a recovered topology, graph results, scored domains and a gate decision.',
  },
  {
    name: 'prreview.py',
    title: 'One pull request through every review skill',
    runs: 'pr-prep, code-xray, peer-review, test-review, concurrency-review, appsec and review-retro on a single change.',
    how: [
      'The pull request’s text, linked issues and threads are kept as untrusted data. Instruction-like text in them becomes a security finding and is never obeyed.',
      'Code plans the review: a tier from size and risk triggers such as money, authentication or migrations, review units of at most 400 lines, and which specialists to route to.',
      'Finders run read-only and in parallel. Each candidate then gets one fresh verifier in a throwaway copy; refuted candidates are dropped.',
      'The recommendation is computed by rule. If the model’s synthesis states a different one, both are written and the computed one stands.',
      'A re-review verifies each open finding against the new commits. Posting is a single comment review — never an approval; a person approves and merges.',
    ],
    returns:
      'A report with a computed recommendation, the findings, re-review rounds, and a record with metrics and proposals.',
  },
]

/** Building blocks the harnesses share; each also works on its own. */
export const harnessTools: { name: string; note: string }[] = [
  {
    name: 'ledger.py',
    note: 'The ledger’s grammar as code: parser, checker and verdict arithmetic. It can check a ledger the skills wrote by hand.',
  },
  {
    name: 'redgreen.py',
    note: 'Proves that new tests fail on the code without the fix and pass with it, for any language, without touching the working tree.',
  },
  {
    name: 'incident.py',
    note: 'Keeps the incident log: timestamps from the system clock, production actions refused without their own confirmation, and a closing gate on contributing factors.',
  },
  {
    name: 'netgraph.py',
    note: 'Turns a topology model into graph metrics and address, flow and diagram checks. The networking skills ship the same script.',
  },
]

export const evalMethod: { title: string; body: string }[] = [
  {
    title: 'Seeded fixtures',
    body: 'Each eval runs a skill against a small repository or document set with defects planted in it, so a naive answer fails: a stale environment variable pointing at a service nothing uses, an incident whose trigger sits nine days before the outage.',
  },
  {
    title: 'Capability versus delta',
    body: 'Every assertion is tagged. Capability asks whether the job got done at all; delta asks whether the skill did what it specifically instructs. Only delta is evidence that the skill helps, so delta is the score shown here.',
  },
  {
    title: 'With the skill, and without',
    body: 'Three runs with the skill against one baseline run without it. Each run sees only the skill’s own folder — no harness and no sibling skills.',
  },
  {
    title: 'Graded by execution',
    body: 'Where they can, graders run what was produced: DDL is executed and probed with rows that must be refused, acceptance tests run against mutants, production levers are stubs that record every call, and every address range and diagram cell is parsed.',
  },
]

export const evalCaveats: string[] = [
  'dbquery scores 1.00 against 0.93: an agent with no skill already ranks by total time and finds the N+1. The skill adds the score and a complete review every time.',
  'dbdiagram scores 1.00 against 0.88: the design it is handed is already written in the target notation, so an agent with no skill draws most of it.',
  'netblueprint scores 1.00 against 0.75: its eval checks that it refuses an unaccepted proposal, which an agent with no skill mostly does too.',
  'pipelines in Propose mode is the lowest with-skill score, 0.93: two of three runs ordered a release-safety step ahead of build-once.',
  'Every baseline is a single run, so a lone miss is a signal to read the run, not a verdict on the skill.',
]

const mean = (values: number[]) => values.reduce((total, value) => total + value, 0) / values.length

/** Mean delta score with the skill and without it, across a set of evals. */
export function averageScore(evals: SkillEval[]) {
  return {
    withSkill: mean(evals.map((evaluation) => evaluation.withSkill)),
    baseline: mean(evals.map((evaluation) => evaluation.baseline)),
  }
}

export const allSkills = families.flatMap((family) => family.skills)
export const allEvals = allSkills.flatMap((skill) => skill.evals)
/** Skill evals plus the harnesses' own end-to-end runs. */
export const evalCount = allEvals.length + harnesses.filter((harness) => harness.evaluation).length
