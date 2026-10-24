import { Diagram, Edge, Group, Node } from '@/components/diagram/diagram'

export function NightlyPipelineDiagram() {
  return (
    <Diagram
      width={780}
      height={390}
      title="Nightly pipeline: core systems to Data Factory to a Delta lakehouse, scored by Databricks with the champion model, results in PostgreSQL"
      caption="Everything right of the VPN lives in one private virtual network; no service has a public endpoint."
    >
      <Group x={190} y={8} w={580} h={372} label="Private VNet · private endpoints only" tone="brand" />

      <Node x={20} y={70} w={140} h={50} label="core systems" sub="on-premises" tone="muted" />
      <Node x={215} y={70} w={150} h={50} label="Data Factory" sub="ingest · orchestrate" />

      <Group x={395} y={36} w={365} h={104} label="ADLS Gen2 · Delta" />
      <Node x={410} y={74} w={105} h={50} label="bronze" sub="as landed" />
      <Node x={525} y={74} w={105} h={50} label="silver" sub="clean · deduped" />
      <Node x={640} y={74} w={105} h={50} label="gold" sub="features" />

      <Node x={430} y={190} w={170} h={52} label="Databricks" sub="nightly Spark job" tone="brand" />
      <Node x={640} y={190} w={120} h={52} label="model registry" sub="@champion" />
      <Node x={430} y={300} w={170} h={52} label="PostgreSQL" sub="scores · reasons" />
      <Node x={215} y={300} w={150} h={52} label="dashboards" sub="Container Apps · BI" />

      <Edge d="M160,95 H211" label="VPN" labelX={186} labelY={95} />
      <Edge d="M365,99 H406" />
      <Edge d="M515,144 V186" arrow="both" label="read · write" labelX={515} labelY={165} />
      <Edge d="M640,216 H604" />
      <Edge d="M515,242 V296" tone="brand" label="write scores" labelX={515} labelY={269} />
      <Edge d="M430,326 H369" label="query" labelX={400} labelY={326} />
    </Diagram>
  )
}

export function MlopsLoopDiagram() {
  return (
    <Diagram
      width={780}
      height={300}
      title="MLOps loop: code push triggers CI, a challenger is trained on a gold snapshot, evaluated against the champion, and promoted by moving an alias"
      caption="Promotion is a pointer move. Rolling back is moving the pointer back."
    >
      <Node x={20} y={30} w={120} h={50} label="git push" sub="main" />
      <Node x={170} y={30} w={150} h={50} label="CI" sub="lint · test · build" />
      <Node x={350} y={30} w={150} h={50} label="container registry" sub="training image" />
      <Node x={540} y={30} w={210} h={50} label="train challenger" sub="ML workspace · MLflow" />
      <Node x={540} y={130} w={210} h={50} label="gold snapshot" sub="Databricks · versioned" tone="muted" />
      <Node x={350} y={130} w={150} h={50} label="evaluate" sub="vs champion, same data" tone="brand" />
      <Node x={350} y={230} w={150} h={50} label="@champion" sub="registry alias" tone="brand" />
      <Node x={540} y={230} w={210} h={50} label="nightly batch" sub="loads @champion" />

      <Edge d="M140,55 H166" />
      <Edge d="M320,55 H346" />
      <Edge d="M500,55 H536" />
      <Edge d="M645,130 V84" label="training data" labelX={645} labelY={107} />
      <Edge d="M560,80 V105 H425 V126" label="metrics" labelX={480} labelY={105} />
      <Edge d="M425,180 V226" tone="brand" label="if better" labelX={425} labelY={203} />
      <Edge d="M500,255 H536" />
    </Diagram>
  )
}
