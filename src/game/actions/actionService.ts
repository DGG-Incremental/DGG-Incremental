import * as fp from 'lodash/fp'


export const createActionService = <G, A>(
    pairs: [A, ( action: A, game: G ) => G][]
) => {
    return ( action: A, game: G ) => fp.cond<A, G>(
        pairs.map( ( [a, b] ) => [
            fp.equals( a ),
            ( action ) => b( action, game )
        ] ) )( action )
}
