export type FieldInputValue = Date | string | number
export type OrderBySortItem = Record<string, FieldInputValue>
export type OrderBySortDirection = 'asc' | 'desc'
export type OrderBySortNullPosition = 'first' | 'last'
export type OrderBySortOrderOperator =
  | 'asc'
  | 'asc_nulls_first'
  | 'asc_nulls_last'
  | 'desc'
  | 'desc_nulls_first'
  | 'desc_nulls_last'
type OrderBySortFunction = (
  a: OrderBySortItem,
  b: OrderBySortItem,
  remainingOrderArray: OrderByEntry[]
) => 0 | 1 | -1 | OrderBySortFunction

export interface OrderByEntry {
  field: string
  value: OrderBySortOrderOperator
}

// type guard
function isNumber(x: unknown): x is number {
  return typeof x === 'number'
}

/**
 * Compare function to be used in a vanilla arr.sort function
 * @param a first sorting Element
 * @param b second sorting Element
 * @param direction 'asc' or 'desc', direction to sort
 * @param nullPosition 'first' or 'last', where in the array to put null items
 * @returns sortNumber 0 | 1 | -1, as expected by the vanilla arr.sort function
 */
const compare = (
  a: string | number,
  b: string | number,
  direction: OrderBySortDirection,
  nullPosition: OrderBySortNullPosition
) => {
  // equal items sort equally
  if (a === b) {
    return 0
  }
  // nulls sort before or after anything else
  else if (a === null) {
    return nullPosition === 'first' ? -1 : 1
  } else if (b === null) {
    return nullPosition === 'first' ? 1 : -1
  }
  // otherwise we sort, depending on direction
  else {
    // in both directions we want to clean values
    const cleanedA: number | string = isNumber(a) ? a * 1 : a.toLowerCase() // restore numbers
    const cleanedB: number | string = isNumber(b) ? b * 1 : b.toLowerCase()
    // otherwise, if we're ascending, lowest sorts first
    if (direction === 'asc') {
      return cleanedA < cleanedB ? -1 : 1
    }
    // if descending, highest sorts first
    else {
      return cleanedA < cleanedB ? 1 : -1
    }
  }
}

/**
 * date checks whether the parameter was not a falsy value (undefined, null, 0, "", etc..)
  - Object.prototype.toString.call(date) returns a native string representation of the given object type - In our case "[object Date]". Because date.toString() overrides its parent method, we need to .call or .apply the method from Object.prototype directly which ..
  - Bypasses user-defined object type with the same constructor name (e.g.: "Date")
  - Works across different JS contexts (e.g. iframes) in contrast to instanceof or Date.prototype.isPrototypeOf.
  - !isNaN(date) finally checks whether the value was not an Invalid Date.
  - date instanceof Date at the end is then a type guard for type validity futher down the code
 *
 * @param {*} date
 * @returns
 */
function isDate(date) {
  return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date) && date instanceof Date;
}

// just a little safety check so we don't compare things we can't compare like functions
const isValidField = (field: unknown) => {
  return field === null || ['string', 'number'].includes(typeof field) || isDate(field)
}

// normalizes field values for comparison (eg. converts dates into numbers)
const normalizeField = (field: FieldInputValue) => {
  let normalizedField: string | number
  if (field instanceof Date) {
    normalizedField = field.getTime()
  } else {
    normalizedField = field
  }
  return normalizedField
}

/**
 * Helper function to make different comparisons more readable
 * @param a first sorting Element
 * @param b second sorting Element
 * @param orderEntry Item of the orderArray with ordering conditions
 * @returns sortNumber 0 | 1 | -1, as expected by the vanilla arr.sort function
 */
const determineResult = (a: OrderBySortItem, b: OrderBySortItem, orderEntry: OrderByEntry) => {
  // doing object keys approach to capture falsey values like null
  if (!Object.keys(a).includes(orderEntry.field) || !Object.keys(b).includes(orderEntry.field)) {
    throw new Error(`Object in array is missing field ${orderEntry.field}`)
  }
  if (!isValidField(a[orderEntry.field]) || !isValidField(b[orderEntry.field])) {
    throw new Error(
      `Field ${orderEntry.field} is of invalid type, only string, number and date are allowed`
    )
  }
  // normalize fields for comparison
  const fieldA = normalizeField(a[orderEntry.field])
  const fieldB = normalizeField(b[orderEntry.field])
  if (orderEntry.value === 'asc' || orderEntry.value === 'asc_nulls_last') {
    return compare(fieldA, fieldB, 'asc', 'last')
  } else if (orderEntry.value === 'asc_nulls_first') {
    return compare(fieldA, fieldB, 'asc', 'first')
  } else if (orderEntry.value === 'desc' || orderEntry.value === 'desc_nulls_first') {
    return compare(fieldA, fieldB, 'desc', 'first')
  } else if (orderEntry.value === 'desc_nulls_last') {
    return compare(fieldA, fieldB, 'desc', 'last')
  }
  throw new Error(`${orderEntry.value} is an invalid OrderOperator`)
}

/**
 * Takes an array of objects and sorts them by an arbitrary number of common string or number fields with control over direction and placement of null elements.
 *
 * @export
 * @param {OrderBySortItem[]} arr Array of Objects with common string or number fields to sort by
 * @param {OrderByEntry[]} orderArray Array of conditions how to sort eg. [{ field: 'author', value: 'asc_nulls_first' }]
 * @returns
 */
export function orderBySort(arr: OrderBySortItem[], orderArray: OrderByEntry[]) {
  // sort mutates the array, so we copy it to avoid side effects
  const arrCopy = [...arr]
  const sort: OrderBySortFunction = (a, b, remainingOrderArray = orderArray) => {
    // calculate the compare value of the first(=next) item to compare with
    const compareValue = determineResult(a, b, remainingOrderArray[0])
    // See if the next key needs to be considered
    const checkNextKey = compareValue === 0 && remainingOrderArray.length !== 1
    // Return compare value (potential recursion)
    return checkNextKey ? sort(a, b, remainingOrderArray.slice(1)) : compareValue
  }
  // @ts-expect-error we're kinda overloading the sort function to make it recursive, so the mismatch is fine
  return arrCopy.sort(sort)
}
