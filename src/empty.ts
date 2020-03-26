import RdfLibTerm from './node-internal'
import { EmptyTermType } from './types'
import { Term } from './tf-types'

/**
* An empty node
*/
export default class Empty extends RdfLibTerm implements Term {
  termType: typeof EmptyTermType = EmptyTermType

  constructor () {
    super('')
  }

  toString () {
    return '()'
  }
}
