import { IRDFlibDataFactory } from '../types'
import Statement from '../statement'
import IndexedFormula from '../store'
import Fetcher from '../fetcher'
import ExtendedTermFactory from './extended-term-factory'

/** Full RDFLib.js Data Factory */
const RDFlibDataFactory: IRDFlibDataFactory = {
  ...ExtendedTermFactory,

  /**
   * Creates a new fetcher
   * @param store - The store to use
   * @param options - The options
   */
  fetcher (store, options): Fetcher {
    return new Fetcher(store, options)
  },

  /**
   * Creates a new graph (store)
   */
  graph (features = undefined, opts = undefined): IndexedFormula {
    return new IndexedFormula(features, opts || {rdfFactory: ExtendedTermFactory})
  },

  /**
   * Creates a new literal node
   * @param val The lexical value
   * @param lang The language
   * @param dt The datatype
   * @deprecated use [[literal]] with the second and third argument combined
   */
  lit (val, lang?, dt?) {
    return this.literal('' + val, lang || dt)
  },

  /**
   * Creates a new statement
   * @param subject The subject
   * @param predicate The predicate
   * @param object The object
   * @param graph The containing graph
   * @deprecated use [[quad]] instead
   */
  st (
    subject,
    predicate,
    object,
    graph?
  ): Statement {
    return this.quad(subject, predicate, object, graph)
  },

  /**
   * Creates a new statement
   * @param subject The subject
   * @param predicate The predicate
   * @param object The object
   * @deprecated use [[quad]] without the last argument instead
   */
  triple (
    subject,
    predicate,
    object
  ): Statement {
    return this.quad(subject, predicate, object)
  },
}

export default RDFlibDataFactory
