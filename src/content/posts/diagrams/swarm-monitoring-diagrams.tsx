import { Diagram, Edge, Node } from '@/components/diagram/diagram'

export function SwarmMonitoringDiagram() {
  return (
    <Diagram
      width={790}
      height={380}
      title="Sources feed two Alloy collectors; metrics go to Prometheus, logs to Loki, and Grafana reads both plus a delivery database to drive dashboards and alerts"
      caption="One Alloy owns every metric; a second, log-only Alloy runs on the app node. Grafana also reads delivery metrics straight from PostgreSQL."
    >
      <text
        x={110}
        y={24}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[11px] tracking-wider uppercase"
      >
        Sources
      </text>
      <text
        x={350}
        y={24}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[11px] tracking-wider uppercase"
      >
        Collect
      </text>
      <text
        x={570}
        y={24}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[11px] tracking-wider uppercase"
      >
        Store
      </text>
      <text
        x={725}
        y={24}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[11px] tracking-wider uppercase"
      >
        Use
      </text>

      <Node x={20} y={40} w={180} h={44} label="hosts" sub="node metrics, both nodes" />
      <Node x={20} y={96} w={180} h={44} label="containers" sub="cAdvisor, every node" />
      <Node x={20} y={152} w={180} h={44} label="apps" sub="/metrics, per replica" />
      <Node x={20} y={208} w={180} h={44} label="databases" sub="Postgres, Redis, MSSQL" />
      <Node x={20} y={300} w={180} h={44} label="container logs" sub="Docker, app node" tone="muted" />

      <Node x={260} y={40} w={180} h={212} label="Alloy" sub="data node · all metrics" tone="brand" />
      <Node x={260} y={290} w={180} h={64} label="Alloy" sub="app node · logs only" />

      <Node x={500} y={60} w={140} h={52} label="Prometheus" sub="remote-write · 15d" />
      <Node x={500} y={180} w={140} h={52} label="Loki" sub="logs" />
      <Node x={500} y={300} w={140} h={52} label="PostgreSQL" sub="delivery schema" tone="muted" />

      <Node x={680} y={150} w={90} h={60} label="Grafana" sub="dashboards" tone="brand" />
      <Node x={680} y={290} w={90} h={52} label="alerts" sub="email · chat" />

      <Edge d="M200,62 H256" />
      <Edge d="M200,118 H256" />
      <Edge d="M200,174 H256" />
      <Edge d="M200,230 H256" />
      <Edge d="M200,322 H256" />

      <Edge d="M440,86 H496" tone="brand" />
      <Edge d="M440,206 H496" tone="brand" />
      <Edge d="M440,322 C470,322 468,222 496,222" />

      <Edge d="M640,86 C664,86 660,168 676,168" />
      <Edge d="M640,206 C660,206 660,186 676,186" />
      <Edge d="M640,326 C666,326 660,202 676,202" dashed />
      <Edge d="M725,210 V286" tone="brand" />
    </Diagram>
  )
}
