import Literal from '../literal'
import Statement from '../statement'
import NamedNode from '../named-node'
import BlankNode from '../blank-node'
import Variable from '../variable'
import {
  RdfJsDataFactory,
} from '../tf-types'
import Collection from '../collection'
import Empty from '../empty'
import DefaultGraph from '../default-graph'
import Node from '../node-internal'

// export type Comparable = Term | TFNamedNode | TFBlankNode | TFLiteral | Quad | undefined | null
//
// export type DefaultFactoryTypes = NamedNode | BlankNode | Literal | Variable | Statement

export type Indexable = number | string

// export type Namespace = (term:string) => TFNamedNode
//
// /** A set of features that may be supported by a Data Factory */
export type SupportTable = Record<Feature, boolean>
//
// export type TFIDFactoryTypes = TFNamedNode | TFBlankNode | TFLiteral | Quad | TFVariable | Term
//
export enum Feature {
  /** Whether the factory supports termType:Collection terms */
  collections = "COLLECTIONS",
  /** Whether the factory supports termType:DefaultGraph terms */
  defaultGraphType = "DEFAULT_GRAPH_TYPE",
  /** Whether the factory supports equals on produced instances */
  equalsMethod = "EQUALS_METHOD",
  /** Whether the factory can create a unique idempotent identifier for the given term. */
  id = "ID",
  /**
   * Whether the factory will return the same instance for subsequent calls.
   * This implies `===`, which means methods like `indexOf` can be used.
   */
  identity = "IDENTITY",
  /** Whether the factory supports mapping ids back to instances (should adhere to the identity setting) */
  reversibleId = "REVERSIBLE_ID",
  /** Whether the factory supports termType:Variable terms */
  variableType = "VARIABLE_TYPE",
}

/**
 * Defines a DataFactory as used in rdflib, based on the RDF/JS: Data model specification,
 * but with additional extensions
 *
 * bnIndex is optional but useful.
 */
export interface DataFactory<
  BLANK_NODE = BlankNode,
  COLLECTION = Collection,
  DEFAULT_GRAPH = DefaultGraph,
  EMPTY = Empty,
  LITERAL = Literal,
  NAMED_NODE = NamedNode,
  STATEMENT = Statement,
  TERM = Node,
  VARIABLE = Variable,
  IndexType = Indexable
> extends RdfJsDataFactory<BLANK_NODE, COLLECTION, DEFAULT_GRAPH, EMPTY, LITERAL, NAMED_NODE, STATEMENT, TERM, VARIABLE> {
  /**
   * BlankNode index
   * @private
  */
  bnIndex?: number

  supports: SupportTable

  literal(value: string, languageOrDatatype?: string | NAMED_NODE): LITERAL

  isQuad(obj: any): obj is STATEMENT

  equals(
    a: BLANK_NODE | LITERAL | NAMED_NODE | STATEMENT | TERM | undefined | null,
    b: BLANK_NODE | LITERAL | NAMED_NODE | STATEMENT | TERM | undefined | null
  ): boolean

  toNQ(term: BLANK_NODE | COLLECTION | LITERAL | NAMED_NODE | STATEMENT | TERM): string

  quad(
    subject: BLANK_NODE | NAMED_NODE | VARIABLE,
    predicate: BLANK_NODE | NAMED_NODE | VARIABLE,
    object: BLANK_NODE | COLLECTION | EMPTY | LITERAL | NAMED_NODE | VARIABLE,
    graph?: DEFAULT_GRAPH | NAMED_NODE | VARIABLE,
  ): STATEMENT;

  quadToNQ(term: STATEMENT): string

  termToNQ(term: TERM): string

  /**
   * Generates a unique session-idempotent identifier for the given object.
   *
   * @example NQ serialization (reversible from value)
   * @example MD5 hash of termType + value (irreversible from value, map needed)
   *
   * @return {Indexable} A unique value which must also be a valid JS object key type.
   */
  id(obj: BLANK_NODE | COLLECTION | LITERAL | NAMED_NODE | STATEMENT | TERM): IndexType
}
