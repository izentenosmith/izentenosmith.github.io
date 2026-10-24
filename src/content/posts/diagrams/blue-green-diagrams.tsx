import { Diagram, Edge, Group, Node } from '@/components/diagram/diagram'

export function BlueGreenDiagram() {
  return (
    <Diagram
      width={760}
      height={370}
      title="Nginx routes traffic to the active stack; the idle stack waits on other ports"
      caption="Both stacks run all the time on one VM. A symlink decides which one Nginx sends traffic to."
    >
      <Node x={20} y={152} w={100} h={46} label="Users" sub="HTTPS" />
      <Node x={175} y={140} w={170} h={70} label="Nginx" sub="TLS · reverse proxy" tone="brand" />
      <Node x={175} y={262} w={170} h={50} label="active-upstream.conf" sub="symlink → blue" mono tone="muted" />

      <Group x={405} y={20} w={340} h={160} label="blue · active" tone="brand" />
      <Node x={425} y={52} w={145} h={46} label="frontend" sub=":5001" />
      <Node x={585} y={52} w={145} h={46} label="backend" sub=":4001" />
      <Node x={425} y={114} w={145} h={46} label="postgres" sub="own database" tone="muted" />
      <Node x={585} y={114} w={145} h={46} label="rabbitmq" sub="own broker" tone="muted" />

      <Group x={405} y={194} w={340} h={160} label="green · idle" />
      <Node x={425} y={226} w={145} h={46} label="frontend" sub=":5002" />
      <Node x={585} y={226} w={145} h={46} label="backend" sub=":4002" />
      <Node x={425} y={288} w={145} h={46} label="postgres" sub="own database" tone="muted" />
      <Node x={585} y={288} w={145} h={46} label="rabbitmq" sub="own broker" tone="muted" />

      <Edge d="M120,175 H171" />
      <Edge d="M260,210 V258" dashed arrow="none" />
      <Edge d="M345,160 C380,160 375,100 401,100" tone="brand" />
      <Edge d="M345,190 C380,190 375,274 401,274" dashed />
    </Diagram>
  )
}
