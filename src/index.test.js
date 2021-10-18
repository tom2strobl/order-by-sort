import { orderBySort } from './'

const entityArray = [
  { id: 5, rating: null, author: 'Wilma', date: '2021-01-02' },
  { id: 7, rating: null, author: null, date: '2021-01-01' },
  { id: 1, rating: 1, author: 'Paul', date: '2021-01-03' },
  { id: 2, rating: 3, author: 'Anne', date: '2021-01-01' },
  { id: 4, rating: 3, author: 'Paul', date: '2021-01-03' },
  { id: 3, rating: null, author: 'Frank', date: '2021-01-01' },
  { id: 6, rating: null, author: null, date: '2021-01-01' },
]

test('sorts number desc_nulls_first and then stringdate asc, also makes sure null is a valid value', () => {
  const orderByArray = [
    { field: 'rating', value: 'desc_nulls_first' },
    { field: 'date', value: 'asc' }
  ]
  const sortedArray = orderBySort(entityArray, orderByArray)
  const expectedSortedArray = [
    { id: 7, rating: null, author: null, date: '2021-01-01' },
    { id: 3, rating: null, author: 'Frank', date: '2021-01-01' },
    { id: 6, rating: null, author: null, date: '2021-01-01' },
    { id: 5, rating: null, author: 'Wilma', date: '2021-01-02' },
    { id: 2, rating: 3, author: 'Anne', date: '2021-01-01' },
    { id: 4, rating: 3, author: 'Paul', date: '2021-01-03' },
    { id: 1, rating: 1, author: 'Paul', date: '2021-01-03' }
  ]
  expect(sortedArray).toEqual(expectedSortedArray)
})

test('sorts string asc_nulls_last, then stringdate asc and then number desc', () => {
  const orderByArray = [
    { field: 'author', value: 'asc_nulls_last' },
    { field: 'date', value: 'asc' },
    { field: 'rating', value: 'desc' }
  ]
  const sortedArray = orderBySort(entityArray, orderByArray)
  const expectedSortedArray = [
    { id: 2, rating: 3, author: 'Anne', date: '2021-01-01' },
    { id: 3, rating: null, author: 'Frank', date: '2021-01-01' },
    { id: 4, rating: 3, author: 'Paul', date: '2021-01-03' },
    { id: 1, rating: 1, author: 'Paul', date: '2021-01-03' },
    { id: 5, rating: null, author: 'Wilma', date: '2021-01-02' },
    { id: 7, rating: null, author: null, date: '2021-01-01' },
    { id: 6, rating: null, author: null, date: '2021-01-01' }
  ]
  expect(sortedArray).toEqual(expectedSortedArray)
})

test('sorts number asc_nulls_first and then stringdate desc_nulls_last', () => {
  const orderByArray = [
    { field: 'rating', value: 'asc_nulls_first' },
    { field: 'date', value: 'desc_nulls_last' }
  ]
  const sortedArray = orderBySort(entityArray, orderByArray)
  const expectedSortedArray = [
    { id: 5, rating: null, author: 'Wilma', date: '2021-01-02' },
    { id: 7, rating: null, author: null, date: '2021-01-01' },
    { id: 3, rating: null, author: 'Frank', date: '2021-01-01' },
    { id: 6, rating: null, author: null, date: '2021-01-01' },
    { id: 1, rating: 1, author: 'Paul', date: '2021-01-03' },
    { id: 4, rating: 3, author: 'Paul', date: '2021-01-03' },
    { id: 2, rating: 3, author: 'Anne', date: '2021-01-01' }
  ]
  expect(sortedArray).toEqual(expectedSortedArray)
})

test('sorts rating asc_nulls_first, then date desc_nulls_last, lastly id asc_nulls_last', () => {
  const orderByArray = [
    { field: 'rating', value: 'asc_nulls_first' },
    { field: 'date', value: 'desc_nulls_last' },
    { field: 'id', value: 'asc_nulls_last' }
  ]
  const entityArrayWithDates = entityArray.map(({ date, ...rest }) => {
    return { ...rest, date: new Date(date)}
  })
  const sortedArray = orderBySort(entityArrayWithDates, orderByArray)
  const expectedSortedArray = [
    { id: 5, rating: null, author: 'Wilma', date: new Date('2021-01-02') },
    { id: 3, rating: null, author: 'Frank', date: new Date('2021-01-01') },
    { id: 6, rating: null, author: null, date: new Date('2021-01-01') },
    { id: 7, rating: null, author: null, date: new Date('2021-01-01') },
    { id: 1, rating: 1, author: 'Paul', date: new Date('2021-01-03') },
    { id: 4, rating: 3, author: 'Paul', date: new Date('2021-01-03') },
    { id: 2, rating: 3, author: 'Anne', date: new Date('2021-01-01') }
  ]
  expect(sortedArray).toEqual(expectedSortedArray)
})

test('throw on missing field', () => {
  const orderByArray = [
    { field: 'reader', value: 'asc_nulls_last' }
  ]
  expect(() => orderBySort(entityArray, orderByArray)).toThrow(`Object in array is missing field ${orderByArray[0].field}`)
})

test('throw on invalid field type', () => {
  const malformedEntityArray = [
    { id: 1, rating: () => {} },
    { id: 3, rating: 1 },
  ]
  const orderByArray = [
    { field: 'rating', value: 'asc_nulls_last' }
  ]
  expect(() => orderBySort(malformedEntityArray, orderByArray)).toThrow(`Field ${orderByArray[0].field} is of invalid type, only string, number and date are allowed`)
})

test('throw on invalid order operator', () => {
  const orderByArray = [
    { field: 'rating', value: 'asc_null_last' }
  ]
  expect(() => orderBySort(entityArray, orderByArray)).toThrow(`${orderByArray[0].value} is an invalid OrderOperator`)
})
