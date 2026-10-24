import { Diagram, Edge, Group, Node } from '@/components/diagram/diagram'

export function MonitoringFlowDiagram() {
  return (
    <Diagram
      width={780}
      height={470}
      title="Prometheus discovers devices from an inventory service, scrapes them through SNMP and ICMP exporters, and Grafana visualizes the results"
      caption="Numbers follow one cycle: discover targets, scrape through the exporters, query and display."
    >
      <Group x={20} y={16} w={740} h={92} label="Visualization" />
      <Node x={60} y={46} w={120} h={46} label="Operator" sub="browser" />
      <Node x={560} y={46} w={150} h={46} label="Grafana" sub="dashboards · maps" />
      <Edge d="M180,69 H556" label="8 · views dashboards" labelX={368} labelY={69} />

      <Group x={20} y={128} w={740} h={112} label="Discovery" tone="brand" />
      <Node x={40} y={164} w={150} h={52} label="Prometheus" sub="scrape · store · alert" tone="brand" />
      <Node x={320} y={164} w={160} h={52} label="discovery service" sub="Go · GET /targets" />
      <Node x={580} y={164} w={160} h={52} label="inventory" sub="PostgreSQL" tone="muted" />
      <Edge d="M190,180 H316" label="1 · GET /targets" labelX={253} labelY={180} />
      <Edge d="M320,202 H194" label="4 · target JSON" labelX={253} labelY={202} />
      <Edge d="M480,180 H576" label="2 · query" labelX={528} labelY={180} />
      <Edge d="M580,202 H484" label="3 · devices" labelX={528} labelY={202} />
      <Edge d="M635,92 V112 H115 V160" label="7 · PromQL" labelX={375} labelY={112} />

      <Group x={20} y={260} w={740} h={194} label="Scraping" />
      <Node x={270} y={292} w={170} h={46} label="snmp_exporter" sub=":9116" mono />
      <Node x={270} y={384} w={170} h={46} label="blackbox_exporter" sub=":9115 · icmp" mono />
      <Node x={570} y={336} w={170} h={52} label="network devices" sub="switches · routers" tone="muted" />
      <Edge d="M165,216 V315 H266" label="5a · /snmp" labelX={215} labelY={315} />
      <Edge d="M125,216 V407 H266" label="5b · /probe" labelX={195} labelY={407} />
      <Edge d="M440,315 C510,315 505,352 566,352" label="6a · SNMP" labelX={505} labelY={322} />
      <Edge d="M440,407 C510,407 505,372 566,372" label="6b · ping" labelX={505} labelY={400} />
    </Diagram>
  )
}
