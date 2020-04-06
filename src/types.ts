import Node from './node-internal'
import Variable from './variable'
import BlankNode from './blank-node'
import Collection from './collection'
import Literal from './literal'
import NamedNode from './named-node'
import DefaultGraph from './default-graph'
import { DataFactory } from './factories/factory-types'
import IndexedFormula from './store'
import Fetcher from './fetcher'
import Statement from './statement'
import Empty from './empty'

export const NamedNodeTermType = "NamedNode" as const
export const BlankNodeTermType = "BlankNode" as const
export const LiteralTermType = "Literal" as const
export const VariableTermType = "Variable" as const
export const DefaultGraphTermType = "DefaultGraph" as const
// Non-RDF/JS types:
export const CollectionTermType = "Collection" as const
export const EmptyTermType = "Empty" as const
export const GraphTermType = "Graph" as const

export type TermType = typeof NamedNodeTermType
  | typeof BlankNodeTermType
  | typeof LiteralTermType
  | typeof VariableTermType
  | typeof DefaultGraphTermType
  | typeof CollectionTermType
  | typeof EmptyTermType
  | typeof GraphTermType

export const HTMLContentType = "text/html" as const
export const JSONLDContentType = "application/ld+json" as const
export const N3ContentType = "text/n3" as const
export const N3LegacyContentType = "application/n3" as const
export const NQuadsAltContentType = "application/nquads" as const
export const NQuadsContentType = "application/n-quads" as const
export const NTriplesContentType = "application/n-triples" as const
export const RDFXMLContentType = "application/rdf+xml" as const
export const SPARQLUpdateContentType = "application/sparql-update" as const
export const TurtleContentType = "text/turtle" as const
export const TurtleLegacyContentType = "application/x-turtle" as const
export const XHTMLContentType = "application/xhtml+xml" as const

/**
 * A valid mime type header
 */
export type ContentType = typeof RDFXMLContentType
  | typeof HTMLContentType
  | typeof JSONLDContentType
  | typeof N3ContentType
  | typeof N3LegacyContentType
  | typeof NQuadsAltContentType
  | typeof NQuadsContentType
  | typeof SPARQLUpdateContentType
  | typeof TurtleContentType
  | typeof TurtleLegacyContentType
  | typeof XHTMLContentType

/** A type for values that serves as inputs */
export type ValueType = Node | Date | string | number | boolean | undefined | null | Collection

/**
 * In this project, there exist two types for the same kind of RDF concept.
 * We have RDF/JS spec types (standardized, generic), and RDFlib types (internal, specific).
 * When deciding which type to use in a function, it is preferable to accept generic inputs,
 * whenever possible, and provide strict outputs.
 * In some ways, the TF types in here are a bit more strict.
 * Variables are missing, and the statement requires specific types of terms (e.g. NamedNode instead of Term).
 */

/** An RDF/JS Subject */
export type SubjectType = BlankNode | NamedNode | Variable
/** An RDF/JS Predicate *//**/
export type PredicateType = NamedNode | Variable
/** An RDF/JS Object */
export type ObjectType = NamedNode | Literal | Collection | BlankNode | Variable | Empty
/** An RDF/JS Graph */
export type GraphType = DefaultGraph | NamedNode | Variable // | Formula

export interface Bindings {
  [id: string]: Node;
}

/** All the types that a .fromValue() method might return */
export type FromValueReturns<C extends Node = any> = Node | undefined | null | Collection<C>

export interface IRDFlibDataFactory extends DataFactory {
  fetcher: (store: IndexedFormula, options: any) => Fetcher
  lit: (val: string, lang?: string, dt?: NamedNode) => Literal
  graph: (features?, opts?) => IndexedFormula
  st: (
    subject: BlankNode | NamedNode | Variable,
    predicate: BlankNode | NamedNode | Variable,
    object: BlankNode | Literal | NamedNode | Node | Variable,
    graph?: BlankNode | DefaultGraph
  ) => Statement
  triple: (
    subject: BlankNode | NamedNode | Variable,
    predicate: BlankNode | NamedNode | Variable,
    object: BlankNode | Literal | NamedNode | Node | Variable
  ) => Statement
}
