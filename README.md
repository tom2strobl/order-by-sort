# order-by-sort

> Takes an array of objects and sorts them by an arbitrary number of common `string` or `number` fields with control over direction and placement of `null` elements. Apart from the given fields it retains original order (stable sort). The original array will not be modified.

Particularly useful for emulating behaviour of postgres sorting and accepts PostgreSQL compliant ORDER BY options ('asc', 'asc_nulls_first', 'asc_nulls_last', 'desc', 'desc_nulls_first', 'desc_nulls_last'). Which eg. is something you could want if you want to supply correct ordering after mutations in optimistic UI updates on the client before a server responds. Order by options are also 1:1 the one's Hasura uses in their GraphQL schemas.

- *zero* dependencies
- *fully typed* in typescript
- *100%* code test *coverage* (100% Statements 37/37 100% Branches 47/47 100% Functions 6/6 100% Lines 37/37)
- *small* footprint (1.2kb minified)
- leverages vanilla arr.sort to benefit from improving browser implementations
- written in an actually readable way

## Installation

`npm i order-by-sort` or `yarn add order-by-sort`

## Usage

```typescript
const entityArray = [
  { id: 5, rating: null, author: 'Wilma', date: '2021-01-02' },
  { id: 7, rating: null, author: null, date: '2021-01-01' },
  { id: 1, rating: 1, author: 'Paul', date: '2021-01-03' },
  { id: 2, rating: 3, author: 'Anne', date: '2021-01-01' },
  { id: 4, rating: 3, author: 'Paul', date: '2021-01-03' },
  { id: 3, rating: null, author: 'Frank', date: '2021-01-01' },
  { id: 6, rating: null, author: null, date: '2021-01-01' },
]
const orderByArray = [
  { field: 'rating', value: 'desc_nulls_first' },
  { field: 'date', value: 'asc' }
]
const sortedArray = orderBySort(entityArray, orderByArray)
/*
sortedArray is now [
  { id: 7, rating: null, author: null, date: '2021-01-01' },
  { id: 3, rating: null, author: 'Frank', date: '2021-01-01' },
  { id: 6, rating: null, author: null, date: '2021-01-01' },
  { id: 5, rating: null, author: 'Wilma', date: '2021-01-02' },
  { id: 2, rating: 3, author: 'Anne', date: '2021-01-01' },
  { id: 4, rating: 3, author: 'Paul', date: '2021-01-03' },
  { id: 1, rating: 1, author: 'Paul', date: '2021-01-03' }
]
*/
```

`entityArray` OrderBySortItem[] — Array of Objects with common string or number fields to sort by.
`orderByArray` OrderByEntry[] — Array of objects with ordering definitions in pairs of field/value where value is a valid `OrderBySortOrderOperator`

See `src/index.test.js` for more examples and `src/index.ts` for types.

Disclaimer: Performance is not yet tested for ridiculously large datasets. But feel free to do so and let me know.
