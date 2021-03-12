"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.orderBySort = void 0;
// type guard
function isNumber(x) {
    return typeof x === 'number';
}
/**
 * Compare function to be used in a vanilla arr.sort function
 * @param a first sorting Element
 * @param b second sorting Element
 * @param direction 'asc' or 'desc', direction to sort
 * @param nullPosition 'first' or 'last', where in the array to put null items
 * @returns sortNumber 0 | 1 | -1, as expected by the vanilla arr.sort function
 */
var compare = function (a, b, direction, nullPosition) {
    // equal items sort equally
    if (a === b) {
        return 0;
    }
    // nulls sort before or after anything else
    else if (a === null) {
        return nullPosition === 'first' ? -1 : 1;
    }
    else if (b === null) {
        return nullPosition === 'first' ? 1 : -1;
    }
    // otherwise we sort, depending on direction
    else {
        // in both directions we want to clean values
        var cleanedA = isNumber(a) ? a * 1 : a.toLowerCase(); // restore numbers
        var cleanedB = isNumber(b) ? b * 1 : b.toLowerCase();
        // otherwise, if we're ascending, lowest sorts first
        if (direction === 'asc') {
            return cleanedA < cleanedB ? -1 : 1;
        }
        // if descending, highest sorts first
        else {
            return cleanedA < cleanedB ? 1 : -1;
        }
    }
};
// just a little safety check so we don't compare things we can't compare like functions
var isValidField = function (field) {
    return field === null || ['string', 'number'].includes(typeof field);
};
/**
 * Helper function to make different comparisons more readable
 * @param a first sorting Element
 * @param b second sorting Element
 * @param orderEntry Item of the orderArray with ordering conditions
 * @returns sortNumber 0 | 1 | -1, as expected by the vanilla arr.sort function
 */
var determineResult = function (a, b, orderEntry) {
    // doing object keys approach to capture falsey values like null
    if (!Object.keys(a).includes(orderEntry.field) || !Object.keys(b).includes(orderEntry.field)) {
        throw new Error("Object in array is missing field " + orderEntry.field);
    }
    if (!isValidField(a[orderEntry.field]) || !isValidField(b[orderEntry.field])) {
        throw new Error("Field " + orderEntry.field + " is of invalid type, only string and number are allowed");
    }
    // we can safely type cast since we guarded
    var fieldA = a[orderEntry.field];
    var fieldB = b[orderEntry.field];
    if (orderEntry.value === 'asc' || orderEntry.value === 'asc_nulls_last') {
        return compare(fieldA, fieldB, 'asc', 'last');
    }
    else if (orderEntry.value === 'asc_nulls_first') {
        return compare(fieldA, fieldB, 'asc', 'first');
    }
    else if (orderEntry.value === 'desc' || orderEntry.value === 'desc_nulls_first') {
        return compare(fieldA, fieldB, 'desc', 'first');
    }
    else if (orderEntry.value === 'desc_nulls_last') {
        return compare(fieldA, fieldB, 'desc', 'last');
    }
    throw new Error(orderEntry.value + " is an invalid OrderOperator");
};
/**
 * Takes an array of objects and sorts them by an arbitrary number of common string or number fields with control over direction and placement of null elements.
 *
 * @export
 * @param {OrderBySortItem[]} arr Array of Objects with common string or number fields to sort by
 * @param {OrderByEntry[]} orderArray Array of conditions how to sort eg. [{ field: 'author', value: 'asc_nulls_first' }]
 * @returns
 */
function orderBySort(arr, orderArray) {
    // sort mutates the array, so we copy it to avoid side effects
    var arrCopy = __spreadArray([], arr);
    var sort = function (a, b, remainingOrderArray) {
        if (remainingOrderArray === void 0) { remainingOrderArray = orderArray; }
        // calculate the compare value of the first(=next) item to compare with
        var compareValue = determineResult(a, b, remainingOrderArray[0]);
        // See if the next key needs to be considered
        var checkNextKey = compareValue === 0 && remainingOrderArray.length !== 1;
        // Return compare value (potential recursion)
        return checkNextKey ? sort(a, b, remainingOrderArray.slice(1)) : compareValue;
    };
    // @ts-expect-error we're kinda overloading the sort function to make it recursive, so the mismatch is fine
    return arrCopy.sort(sort);
}
exports.orderBySort = orderBySort;
