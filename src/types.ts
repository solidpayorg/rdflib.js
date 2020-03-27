import RDFLIBTerm from './node-internal'
import RDFLIBVariable from './variable'
import RDFLIBBlankNode from './blank-node'
import Collection from './collection'
import RDFLIBLiteral from './literal'
import RDFLIBNamedNode from './named-node'
import RDFLIBDefaultGraph from './default-graph'
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
export type ValueType = RDFLIBTerm | Date | string | number | boolean | undefined | null | Collection

/**
 * In this project, there exist two types for the same kind of RDF concept.
 * We have RDF/JS spec types (standardized, generic), and RDFLIB types (internal, specific).
 * When deciding which type to use in a function, it is preferable to accept generic inputs,
 * whenever possible, and provide strict outputs.
 * In some ways, the TF types in here are a bit more strict.
 * Variables are missing, and the statement requires specific types of terms (e.g. NamedNode instead of Term).
 */

/** An RDF/JS Subject */
export type SubjectType = RDFLIBBlankNode | RDFLIBNamedNode | RDFLIBVariable
/** An RDF/JS Predicate */
export type PredicateType = RDFLIBNamedNode | RDFLIBVariable
/** An RDF/JS Object */
export type ObjectType = RDFLIBNamedNode | RDFLIBLiteral | Collection | RDFLIBBlankNode | RDFLIBVariable | Empty
/** An RDF/JS Graph */
export type GraphType = RDFLIBDefaultGraph | RDFLIBNamedNode | RDFLIBVariable | RDFLIBBlankNode // | Formula

export interface Bindings {
  [id: string]: RDFLIBTerm;
}

/** All the types that a .fromValue() method might return */
export type FromValueReturns<C extends RDFLIBTerm = any> = RDFLIBTerm | undefined | null | Collection<C>

export interface IRDFLIBDataFactory extends DataFactory<
  RDFLIBNamedNode | RDFLIBBlankNode | RDFLIBLiteral | Collection | Statement
> {
  fetcher: (store: IndexedFormula, options: any) => Fetcher
  lit: (val: string, lang?: string, dt?: RDFLIBNamedNode) => RDFLIBLiteral
  graph: (features?, opts?) => IndexedFormula
  st: (
    subject: SubjectType,
    predicate: PredicateType,
    object: ObjectType,
    graph?: GraphType
  ) => Statement
  triple: (
    subject: SubjectType,
    predicate: PredicateType,
    object: ObjectType
  ) => Statement
}
