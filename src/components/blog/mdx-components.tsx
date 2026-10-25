import type { MDXComponents } from 'mdx/types'
import { Link } from 'react-router'
import { Callout } from './callout'
import { CodeBlock } from './code-block'

export const mdxComponents: MDXComponents = {
  a: ({ href = '', ...props }) =>
    href.startsWith('/') ? (
      <Link to={href} viewTransition {...props} />
    ) : (
      <a href={href} target={href.startsWith('#') ? undefined : '_blank'} rel="noreferrer" {...props} />
    ),
  table: (props) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  pre: CodeBlock,
  Callout,
}
