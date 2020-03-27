import NamedNode from './named-node'

/**
 * Gets a namespace for the specified namespace's URI
 * @param nsuri - The URI for the namespace
 */
export default function Namespace (nsuri: string): (ln: string) => NamedNode {
  return function (ln: string): NamedNode {
    return new NamedNode(nsuri + (ln || ''))
  }
}
