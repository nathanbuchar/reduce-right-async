ReduceRightAsync [![Build Status](https://travis-ci.org/nathanbuchar/reduce-right-async.svg?branch=master)](https://travis-ci.org/nathanbuchar/reduce-right-async)
===========

Asynchronous `Array.reduceRight`. The [`reduceRight()`][external_mdn_reduce-right] method applies a function against an accumulator and each value of the array (from right-to-left) to reduce it to a single value.



***



### Installation

```bash
$ npm install reduce-right-async
```


### Syntax

```
reduceRightAsync(array, iteratee, done[, initialValue])
```

**Parameters**

* **`array`** *Array* - The array to reduce.

* **`iteratee`** *Function* - The function to execute on each value in the array, taking five arguments:
  * `prev` *Any* - The value previously returned in the last invocation of the iteratee, or `initialValue` if supplied.

  * `curr` *Any* - The current element being processed in the array.

  * `n` *Integer* - The index of the current element being processed in the array.

  * `arr` *Array* - The array `reduceRightAsync` was called upon.

  * `next` *Function* - The function to call when you are ready to advance to the next element in the array.

* **`done`** *Function* - The function called when the reduce has finished, taking one argument:
  * `result` *Any* - The value that results from the reduction.

* **`initialValue`** *Any* (Optional) - Value to use as the first argument to the first call of the `iteratee`.

[More information][external_mdn_reduce-right] on how `reduceRight` works.


### Examples

* Asynchronously sum all the values of an array.

  ```js
  reduceRightAsync([0, 1, 2, 3], (prev, curr, n, arr, next) => {
    doSomethingAsync(() => {
      next(prev + curr);
    });
  }, result => {
    // result == 6
  }));
  ```

* Asynchronously flatten an array of arrays,

  ```js
  reduceRightAsync([[0, 1], [2, 3], [4, 5]], (prev, curr, n, arr, next) => {
    doSomethingAsync(() => {
      next(prev.concat(curr));
    });
  }, result => {
    // result is [4, 5, 2, 3, 0, 1]
  }));
  ```

* Asynchronously concatenate all words within an array together starting from an initial value of `"baz"`.

  ```js
  reduceRightAsync(['foo', 'bar']], (prev, curr, n, arr, next) => {
    doSomethingAsync(() => {
      next(prev + curr);
    });
  }, result => {
    // result is "bazbarfoo"
  }, 'baz'));
  ```



***



Authors
-------
* [Nathan Buchar]


License
-------
[ISC](./LICENSE)






[external_mdn_reduce-right]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight

[Nathan Buchar]: mailto:hello@nathanbuchar.com
