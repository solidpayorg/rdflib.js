import Fetcher from './fetcher'
import log from './log'
import { docpart } from './uri'
import { string_startswith } from './utils-js'
import BlankNode from './blank-node'
import NamedNode from './named-node'
import Variable from './variable'
import Collection from './collection'
import Empty from './empty'
import Node from './node-internal'
import Statement from './statement'
import Literal from './literal'
import DefaultGraph from './default-graph'
import { RdfJsDataFactory } from './tf-types'

/** RDF/JS spec Typeguards */

/**
 * Loads ontologies of the data we load (this is the callback from the kb to
 * the fetcher).
 */
export function AJAR_handleNewTerm (kb: { fetcher: Fetcher }, p, requestedBy) {
  var sf: Fetcher | null = null
  if (typeof kb.fetcher !== 'undefined') {
    sf = kb.fetcher
  } else {
    return
  }
  if (p.termType !== 'NamedNode') return
  var docuri = docpart(p.uri)
  var fixuri
  if (p.uri.indexOf('#') < 0) { // No hash
    // @@ major hack for dbpedia Categories, which spread indefinitely
    if (string_startswith(p.uri, 'http://dbpedia.org/resource/Category:')) return

    /*
      if (string_startswith(p.uri, 'http://xmlns.com/foaf/0.1/')) {
      fixuri = "http://dig.csail.mit.edu/2005/ajar/ajaw/test/foaf"
      // should give HTTP 303 to ontology -- now is :-)
      } else
    */
    if (string_startswith(p.uri,
            'http://purl.org/dc/elements/1.1/') ||
          string_startswith(p.uri, 'http://purl.org/dc/terms/')) {
      fixuri = 'http://dublincore.org/2005/06/13/dcq'
    // dc fetched multiple times
    } else if (string_startswith(p.uri, 'http://xmlns.com/wot/0.1/')) {
      fixuri = 'http://xmlns.com/wot/0.1/index.rdf'
    } else if (string_startswith(p.uri, 'http://web.resource.org/cc/')) {
      //            log.warn("creative commons links to html instead of rdf. doesn't seem to content-negotiate.")
      fixuri = 'http://web.resource.org/cc/schema.rdf'
    }
  }
  if (fixuri) {
    docuri = fixuri
  }
  if (sf && (sf as Fetcher).getState(docuri) !== 'unrequested') return

  if (fixuri) { // only give warning once: else happens too often
    log.warn('Assuming server still broken, faking redirect of <' + p.uri +
      '> to <' + docuri + '>')
  }

  return (sf as any).fetch(docuri, { referringTerm: requestedBy })
}

export const appliedFactoryMethods = [
  'blankNode',
  'defaultGraph',
  'literal',
  'namedNode',
  'quad',
  'variable',
  'supports',
]

const rdf = {
  first: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#first',
  rest: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#rest',
  nil: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil'
}

/**
 * Expands an array of Terms to a set of statements representing the rdf:list.
 * @param rdfFactory - The factory to use
 * @param subject - The iri of the first list item.
 * @param data - The terms to expand into the list.
 * @return The {data} as a set of statements.
 */
export function arrayToStatements<
  BLANK_NODE = BlankNode,
  COLLECTION = Collection,
  DEFAULT_GRAPH = DefaultGraph,
  EMPTY = Empty,
  LITERAL = Literal,
  NAMED_NODE = NamedNode,
  STATEMENT = Statement,
  TERM = Node,
  VARIABLE = Variable
>(
  rdfFactory: RdfJsDataFactory<BLANK_NODE, COLLECTION, DEFAULT_GRAPH, EMPTY, LITERAL, NAMED_NODE, STATEMENT, TERM, VARIABLE>,
  subject: BLANK_NODE | NAMED_NODE | VARIABLE,
  data: TERM[]
): STATEMENT[] {
  const statements: STATEMENT[] = []

  data.forEach((obj, i) => {
    statements.push(rdfFactory.quad(subject, rdfFactory.namedNode(rdf.first), obj as unknown as NAMED_NODE))

    let nextNode
    if (i < data.length - 1) {
      nextNode = rdfFactory.blankNode()
      statements.push(rdfFactory.quad(subject, rdfFactory.namedNode(rdf.rest), nextNode))
    } else {
      statements.push(rdfFactory.quad(subject, rdfFactory.namedNode(rdf.rest), rdfFactory.namedNode(rdf.nil)))
    }

    return nextNode
  })

  return statements
}

export function ArrayIndexOf (arr, item, i: number = 0) {
  var length = arr.length
  if (i < 0) i = length + i
  for (; i < length; i++) {
    if (arr[i] === item) {
      return i
    }
  }
  return -1
}
