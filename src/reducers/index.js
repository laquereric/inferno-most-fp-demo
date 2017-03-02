import { dec, inc, compose, partial } from 'ramda'
import { get, hashMap, merge } from 'mori'
import Actions from '../actions'
import { COUNT } from '../constants/stateKeys'
import { enableLogging } from '../utils/logger'

/******************************************************************************
  Using a mori hashMap to hold app state
*******************************************************************************/

const reducer = (state, action) => {
  // get prev count value from existing state hashMap
  const prevCount = get(state, COUNT)

  // partially apply state argument to make a reusable merge function
  const mergeState = partial(merge, [state])

  // partially apply key argument to make a reusable set function
  const setCount = partial(hashMap, [COUNT])

  // create reusable merge variants via functional composition
  const mergeSetCount = compose(mergeState, setCount)
  const mergeIncCount = compose(mergeSetCount, inc)
  const mergeDecCount = compose(mergeSetCount, dec)

  return Actions.case({
    INCREMENT: () => mergeIncCount(prevCount),
    DECREMENT: () => mergeDecCount(prevCount),
    RESET: () => mergeSetCount(0),
    _: () => state,
  }, action)
}

const reducerWithLogging = (state, action) =>
  enableLogging(state, action, reducer(state, action))

export default reducerWithLogging
