import { ArrowUpRight, BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { Tabs } from 'radix-ui'
import type { CSSProperties, ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { SectionHeading } from '@/components/section-heading'
import { staticPages } from '@/content/seo'
import {
  allEvals,
  allSkills,
  averageScore,
  evalCaveats,
  evalMethod,
  families,
  evalCount,
  harnesses,
  harnessTools,
  type Family,
  type Harness,
  type Skill,
  type SkillEval,
} from '@/content/skills'
import { usePageMeta } from '@/lib/use-page-meta'
import { cn } from '@/lib/utils'

const RFC_URL = 'https://github.com/cloudflare/agent-skills-discovery-rfc'

const overall = averageScore(allEvals)
const score = (value: number) => value.toFixed(2)

const tabs = [
  { value: 'skills', total: allSkills.length },
  { value: 'evals', total: evalCount },
  { value: 'harnesses', total: harnesses.length },
] as const
type Tab = (typeof tabs)[number]['value']

const stats = [
  { value: String(allSkills.length), label: 'skills' },
  { value: String(families.length), label: 'families' },
  { value: String(evalCount), label: 'scored evals' },
  { value: score(overall.withSkill), label: `eval score, against ${score(overall.baseline)} with no skill` },
]

export function SkillsPage() {
  usePageMeta(staticPages[4])
  // The open tab lives in the URL (?tab=evals), so any of the three views can be shared directly.
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('tab')
  const tab: Tab = tabs.find(({ value }) => value === requested)?.value ?? 'skills'

  return (
    <div className="space-y-8 sm:space-y-12">
      <header className="space-y-6 sm:space-y-8">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <h1 className="animate-enter font-heading text-h1 font-semibold sm:text-display">Agent skills</h1>
          <p
            className="animate-enter text-base text-pretty text-muted-foreground sm:text-lg"
            style={{ '--enter-index': 1 } as CSSProperties}
          >
            The skills I give coding agents at work: what each one does, what is in its folder, the books
            behind it, and how it scores with and without the skill.
          </p>
        </div>

        <dl
          className="grid animate-enter grid-cols-2 gap-3 lg:grid-cols-4"
          style={{ '--enter-index': 2 } as CSSProperties}
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col-reverse gap-1 rounded-2xl border bg-card p-4">
              <dt className="text-sm text-pretty text-muted-foreground">{label}</dt>
              <dd className="font-heading text-h2 font-semibold text-metric tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
          This page is a catalogue, not a download. Its shape — a name, a description and a file listing per
          skill — borrows from the{' '}
          <a
            href={RFC_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-brand underline-offset-4 hover:underline"
          >
            Agent Skills Discovery RFC
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
          ; the skill files themselves are not published here.
        </p>
      </header>

      <Tabs.Root
        value={tab}
        onValueChange={(value) =>
          setSearchParams(value === 'skills' ? {} : { tab: value }, {
            replace: true,
            preventScrollReset: true,
          })
        }
        className="space-y-8 sm:space-y-10"
      >
        <Tabs.List aria-label="Catalogue" className="inline-flex gap-1 rounded-pill border bg-card p-1">
          {tabs.map(({ value, total }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-pill px-3 font-label text-xs text-muted-foreground capitalize transition-colors duration-(--dur-hover) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=active]:bg-brand data-[state=active]:text-primary-foreground sm:px-4"
            >
              {value}
              <span aria-hidden="true" className="tabular-nums">
                {total}
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="skills" className="space-y-14 focus-visible:outline-none sm:space-y-20">
          <nav aria-label="Skill families">
            <ul className="flex flex-wrap gap-2">
              {families.map(({ id, name, skills }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-pill border bg-card px-3 text-sm transition-colors duration-(--dur-hover) hover:border-brand/40 hover:text-brand"
                  >
                    {name}
                    <span
                      aria-hidden="true"
                      className="font-label text-xs text-muted-foreground tabular-nums"
                    >
                      {skills.length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {families.map((family) => (
            <FamilySection key={family.id} family={family} />
          ))}
        </Tabs.Content>

        <Tabs.Content value="evals" className="space-y-14 focus-visible:outline-none sm:space-y-20">
          <EvalsView />
        </Tabs.Content>

        <Tabs.Content value="harnesses" className="space-y-14 focus-visible:outline-none sm:space-y-20">
          <HarnessesView />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

function FamilySection({ family }: { family: Family }) {
  const { id, name, tagline, description, flow, skills } = family
  const titleId = `${id}-title`

  return (
    <section id={id} aria-labelledby={titleId} className="scroll-mt-24 space-y-6">
      <div className="max-w-3xl space-y-3">
        <SectionHeading id={titleId} eyebrow={`${skills.length} ${skills.length === 1 ? 'skill' : 'skills'}`}>
          {name}
        </SectionHeading>
        <p className="text-lg text-pretty">{tagline}</p>
        <p className="text-pretty text-muted-foreground">{description}</p>
      </div>

      {flow && (
        <div className="space-y-2">
          <Label>{flow.label}</Label>
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
            {flow.steps.map((step, index) => (
              <li key={step} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 text-muted-foreground" />}
                <span className="rounded-pill border bg-card px-2.5 py-1 font-mono text-xs">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <ul className="space-y-3">
        {skills.map((skill) => (
          <li key={skill.name}>
            <SkillCard skill={skill} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** One skill: a summary row that opens onto its description, folder, sources and evals. */
function SkillCard({ skill }: { skill: Skill }) {
  const { name, summary, description, modes, inspiredBy, files, evals } = skill
  const average = averageScore(evals)

  return (
    <details className="group rounded-2xl border bg-card open:border-brand/40">
      <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 rounded-2xl p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:p-5 [&::-webkit-details-marker]:hidden">
        <h3 className="col-start-1 row-start-1 font-mono text-sm font-medium break-words">{name}</h3>
        <span className="col-start-1 row-start-2 text-sm text-pretty text-muted-foreground">{summary}</span>
        <ScorePair
          {...average}
          className="col-start-1 row-start-3 pt-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:self-start sm:pt-0.5"
        />
        <ChevronDown
          aria-hidden="true"
          className="col-start-2 row-start-1 size-5 text-muted-foreground transition-transform duration-(--dur-hover) group-open:rotate-180 motion-reduce:transition-none sm:col-start-3"
        />
      </summary>

      <div className="space-y-8 border-t p-4 sm:p-5">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>What it does</Label>
              <p className="text-pretty">{description}</p>
              {modes && (
                <ul aria-label="Modes" className="flex flex-wrap gap-1.5 pt-1">
                  {modes.map((mode) => (
                    <li key={mode} className="rounded-pill border px-2.5 py-0.5 font-label text-xs">
                      {mode}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {inspiredBy.length > 0 && (
              <div className="space-y-2">
                <Label>Inspired by</Label>
                <ul className="space-y-2">
                  {inspiredBy.map((source) => (
                    <li key={source} className="flex items-start gap-2.5 text-sm text-pretty">
                      <BookOpen aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Folder</Label>
            <div className="rounded-xl border bg-background p-4">
              <p className="font-mono text-sm font-medium break-words">{name}/</p>
              <ul className="mt-3 ml-1.5 space-y-3 border-l pl-4">
                <FileItem
                  path="SKILL.md"
                  note="The skill itself: when to use it, and the workflow the agent follows."
                />
                {files.map((file) => (
                  <FileItem key={file.path} {...file} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{evals.length === 1 ? 'Eval' : 'Evals'}</Label>
          <ul className="divide-y rounded-xl border bg-background">
            {evals.map((evaluation) => (
              <EvalItem key={evaluation.name} evaluation={evaluation} />
            ))}
          </ul>
        </div>
      </div>
    </details>
  )
}

function FileItem({ path, note }: { path: string; note: string }) {
  return (
    <li className="space-y-0.5">
      <p className="font-mono text-[0.8125rem] break-words">{path}</p>
      <p className="text-sm text-pretty text-muted-foreground">{note}</p>
    </li>
  )
}

function EvalItem({ evaluation }: { evaluation: SkillEval }) {
  const { name, checks, withSkill, baseline } = evaluation
  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-6">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-medium text-balance">{name}</p>
        <p className="text-sm text-pretty text-muted-foreground">{checks}</p>
      </div>
      <ScorePair withSkill={withSkill} baseline={baseline} className="shrink-0" />
    </li>
  )
}

/** The score with the skill over the score without it: two bars and the two numbers. */
function ScorePair({
  withSkill,
  baseline,
  className,
}: {
  withSkill: number
  baseline?: number
  className?: string
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <span aria-hidden="true" className="block w-20 space-y-1">
        <Bar value={withSkill} className="bg-metric" />
        {baseline !== undefined && <Bar value={baseline} className="bg-muted-foreground/60" />}
      </span>
      <span className="font-label text-xs whitespace-nowrap tabular-nums">
        <span className="font-semibold text-metric">{score(withSkill)}</span>
        <span className="sr-only"> with the skill</span>
        {baseline !== undefined && (
          <span className="text-muted-foreground">
            {' '}
            vs {score(baseline)}
            <span className="sr-only"> without it</span>
          </span>
        )}
      </span>
    </span>
  )
}

function Bar({ value, className }: { value: number; className: string }) {
  return (
    <span className="block h-1.5 overflow-hidden rounded-pill bg-muted">
      <span className={cn('block h-full rounded-pill', className)} style={{ width: `${value * 100}%` }} />
    </span>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-label text-xs tracking-wider text-muted-foreground uppercase">{children}</p>
}

function EvalsView() {
  return (
    <>
      <section aria-labelledby="method-title" className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <SectionHeading id="method-title" eyebrow="Method">
            How the skills are measured
          </SectionHeading>
          <p className="text-pretty text-muted-foreground">
            A skill is a prompt, and a prompt's claims about its own behaviour are hypotheses until something
            checks them. Every skill here has at least one scored eval; scores run from 0 to 1.
          </p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {evalMethod.map(({ title, body }) => (
            <li key={title} className="spotlight space-y-2 rounded-2xl border bg-card p-5">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-pretty text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="results-title" className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <SectionHeading id="results-title" eyebrow="Results">
            Scores by family
          </SectionHeading>
          <p className="text-pretty text-muted-foreground">
            The mean score across each family's evals, with the skill and without it. Per-eval results are on
            each skill's card.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b font-label text-xs tracking-wider text-muted-foreground uppercase">
              <tr>
                <th scope="col" className="p-4 font-normal">
                  Family
                </th>
                <th scope="col" className="hidden p-4 text-right font-normal sm:table-cell">
                  Skills
                </th>
                <th scope="col" className="hidden p-4 text-right font-normal sm:table-cell">
                  Evals
                </th>
                <th scope="col" className="p-4 font-normal">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {families.map(({ id, name, skills }) => {
                const evals = skills.flatMap((skill) => skill.evals)
                return (
                  <tr key={id}>
                    <th scope="row" className="p-4 font-medium">
                      {name}
                    </th>
                    <td className="hidden p-4 text-right tabular-nums sm:table-cell">{skills.length}</td>
                    <td className="hidden p-4 text-right tabular-nums sm:table-cell">{evals.length}</td>
                    <td className="p-4">
                      <ScorePair {...averageScore(evals)} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="border-t bg-muted/50">
              <tr>
                <th scope="row" className="p-4 font-medium">
                  All skills
                </th>
                <td className="hidden p-4 text-right tabular-nums sm:table-cell">{allSkills.length}</td>
                <td className="hidden p-4 text-right tabular-nums sm:table-cell">{allEvals.length}</td>
                <td className="p-4">
                  <ScorePair {...overall} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section aria-labelledby="caveats-title" className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <SectionHeading id="caveats-title" eyebrow="Caveats">
            Where the gain is smallest
          </SectionHeading>
          <p className="text-pretty text-muted-foreground">
            A capable agent already does much of this unprompted. These are the results I would question
            first.
          </p>
        </div>
        <ul className="max-w-3xl space-y-3">
          {evalCaveats.map((caveat) => (
            <li
              key={caveat}
              className="relative pl-4 text-pretty text-foreground/90 before:absolute before:top-[0.65em] before:left-0 before:size-1 before:rounded-full before:bg-muted-foreground/60"
            >
              {caveat}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function HarnessesView() {
  return (
    <>
      <section aria-labelledby="harness-title" className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <SectionHeading id="harness-title" eyebrow="Rules as code">
            The harnesses
          </SectionHeading>
          <p className="text-pretty text-muted-foreground">
            The skills state hard rules in prose, which leaves the agent as both worker and referee. A harness
            moves the referee into a program: it runs a skill's judgment through headless agent calls and
            enforces in code everything that is not judgment. Each is plain standard-library Python and
            optional; every skill still works on its own.
          </p>
        </div>
        <ul className="space-y-3">
          {harnesses.map((harness) => (
            <li key={harness.name}>
              <HarnessCard harness={harness} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tools-title" className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <SectionHeading id="tools-title" eyebrow="Shared">
            The tools they share
          </SectionHeading>
          <p className="text-pretty text-muted-foreground">
            A harness cannot make a judgment better. It makes sure the judgment happens, on the right inputs,
            and is recorded in a shape the next stage can trust.
          </p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {harnessTools.map(({ name, note }) => (
            <li key={name} className="spotlight space-y-2 rounded-2xl border bg-card p-5">
              <h3 className="font-mono text-sm font-medium">{name}</h3>
              <p className="text-sm text-pretty text-muted-foreground">{note}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function HarnessCard({ harness }: { harness: Harness }) {
  const { name, title, runs, how, returns, evaluation } = harness

  return (
    <article className="grid gap-6 rounded-2xl border bg-card p-4 sm:p-5 lg:grid-cols-12 lg:gap-10">
      <header className="space-y-3 lg:col-span-4">
        <div className="space-y-1">
          <p className="font-mono text-sm text-muted-foreground">{name}</p>
          <h3 className="font-heading text-h3 font-semibold text-balance">{title}</h3>
        </div>
        <div className="space-y-1">
          <Label>Runs</Label>
          <p className="text-sm text-pretty">{runs}</p>
        </div>
        <div className="space-y-1">
          <Label>Returns</Label>
          <p className="text-sm text-pretty">{returns}</p>
        </div>
      </header>

      <div className="space-y-4 lg:col-span-8">
        <div className="space-y-2">
          <Label>How it works</Label>
          <ul className="space-y-2.5">
            {how.map((step) => (
              <li
                key={step}
                className="relative pl-4 text-sm text-pretty before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-brand"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>

        {evaluation && (
          <div className="space-y-2">
            <Label>Eval</Label>
            <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium text-balance">{evaluation.name}</p>
                <p className="text-sm text-pretty text-muted-foreground">{evaluation.checks}</p>
              </div>
              <ScorePair withSkill={evaluation.withSkill} className="shrink-0" />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
