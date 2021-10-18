export declare type FieldInputValue = Date | string | number;
export declare type OrderBySortItem = Record<string, FieldInputValue>;
export declare type OrderBySortDirection = 'asc' | 'desc';
export declare type OrderBySortNullPosition = 'first' | 'last';
export declare type OrderBySortOrderOperator = 'asc' | 'asc_nulls_first' | 'asc_nulls_last' | 'desc' | 'desc_nulls_first' | 'desc_nulls_last';
export interface OrderByEntry {
    field: string;
    value: OrderBySortOrderOperator;
}
/**
 * Takes an array of objects and sorts them by an arbitrary number of common string or number fields with control over direction and placement of null elements.
 *
 * @export
 * @param {OrderBySortItem[]} arr Array of Objects with common string or number fields to sort by
 * @param {OrderByEntry[]} orderArray Array of conditions how to sort eg. [{ field: 'author', value: 'asc_nulls_first' }]
 * @returns
 */
export declare function orderBySort(arr: OrderBySortItem[], orderArray: OrderByEntry[]): OrderBySortItem[];
