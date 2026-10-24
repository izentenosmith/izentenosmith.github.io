import { Diagram, Edge, EdgeLabel, Node } from '@/components/diagram/diagram'

export function CatalogToInstanceDiagram() {
  return (
    <Diagram
      width={760}
      height={330}
      title="Catalog, configuration and instance layers for issues and tickets"
      caption="Catalogs say what exists, configurations say how pieces combine, instances record what happened."
    >
      <text x={110} y={30} textAnchor="middle" className="fill-muted-foreground font-mono text-[11px] tracking-wider uppercase">
        Catalog
      </text>
      <text x={380} y={30} textAnchor="middle" className="fill-muted-foreground font-mono text-[11px] tracking-wider uppercase">
        Configuration
      </text>
      <text x={650} y={30} textAnchor="middle" className="fill-muted-foreground font-mono text-[11px] tracking-wider uppercase">
        Instance
      </text>

      <Node x={30} y={52} w={160} h={50} label="issue_catalog" sub="what can be reported" mono />
      <Node x={300} y={52} w={160} h={50} label="issue_configuration" sub="catalog × issue type" mono tone="brand" />
      <Node x={570} y={52} w={160} h={50} label="issue" sub="one report" mono />

      <Node x={300} y={152} w={160} h={50} label="workflow_group" sub="versioned task graph" mono tone="brand" />

      <Node x={30} y={252} w={160} h={50} label="ticket_catalog" sub="what can be done" mono />
      <Node x={300} y={252} w={160} h={50} label="ticket_configuration" sub="task × dept × SLAs" mono tone="brand" />
      <Node x={570} y={252} w={160} h={50} label="ticket" sub="one unit of work" mono />

      <Edge d="M190,77 H296" />
      <Edge d="M460,77 H566" label="instantiates" labelX={513} labelY={77} />
      <Edge d="M190,277 H296" />
      <Edge d="M460,277 H566" label="instantiates" labelX={513} labelY={277} />
      <Edge d="M380,102 V148" label="resolved by" labelX={380} labelY={125} />
      <Edge d="M380,202 V248" label="nodes" labelX={380} labelY={225} />
      <Edge d="M650,102 V248" tone="brand" label="spawns" labelX={650} labelY={175} />
    </Diagram>
  )
}

export function WorkflowDagDiagram() {
  return (
    <Diagram
      width={600}
      height={250}
      title="Example workflow: diagnose, then repair and order a part in parallel, then verify"
      caption="Each node is a ticket configuration. Two branches run in parallel; verification waits for both."
    >
      <Node x={30} y={100} w={130} h={46} label="Diagnose" sub="root" />
      <Node x={235} y={30} w={140} h={46} label="Repair wiring" sub="electrical" />
      <Node x={235} y={170} w={140} h={46} label="Order part" sub="procurement" />
      <Node x={440} y={100} w={130} h={46} label="Verify fix" sub="maintenance" tone="brand" />

      <Edge d="M160,113 C200,113 195,53 231,53" />
      <Edge d="M160,133 C200,133 195,193 231,193" />
      <Edge d="M375,53 C415,53 405,113 436,113" />
      <Edge d="M375,193 C415,193 405,133 436,133" />
      <EdgeLabel x={300} y={123}>
        parallel
      </EdgeLabel>
    </Diagram>
  )
}
