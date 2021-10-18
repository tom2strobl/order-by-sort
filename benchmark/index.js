const b = require("benny");
const orderBySort = require("../lib");

b.suite(
  "order-by-sort Benchmark",

  b.add("7 items, two OrderBySorts", () => {
    const entityArray = [
      { id: 5, rating: null, author: "Wilma", date: "2021-01-02" },
      { id: 7, rating: null, author: null, date: "2021-01-01" },
      { id: 1, rating: 1, author: "Paul", date: "2021-01-03" },
      { id: 2, rating: 3, author: "Anne", date: "2021-01-01" },
      { id: 4, rating: 3, author: "Paul", date: "2021-01-03" },
      { id: 3, rating: null, author: "Frank", date: "2021-01-01" },
      { id: 6, rating: null, author: null, date: "2021-01-01" },
    ];
    const orderByArray = [
      { field: "rating", value: "desc_nulls_first" },
      { field: "date", value: "asc" },
    ];
    return orderBySort.orderBySort(entityArray, orderByArray);
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: "benchmark", version: "1.0.0" }),
  b.save({ file: "benchmark", format: "chart.html" })
);
