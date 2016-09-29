/* global describe, it */

'use strict';

const chai = require('chai');

const reduceRightAsync = require('../reduce-right-async');

const expect = chai.expect;
const should = chai.should();

describe('reduceRightAsync', () => {

  describe('interface', () => {

    it('should throw if the first parameter is not an array', () => {
      expect(() => {
        reduceRightAsync(false);
      }).to.throw(TypeError, /must be called on an array/);
    });

    it('should throw if the second parameter is not a function', () => {
      expect(() => {
        reduceRightAsync([], false);
      }).to.throw(TypeError, /must be a function/);
    });

    it('should throw if the third parameter is not a function', () => {
      expect(() => {
        reduceRightAsync([], () => {}, false);
      }).to.throw(TypeError, /must be a function/);
    });

    it('should throw if the first parameter is an empty array and no initial value is specified', () => {
      expect(() => {
        reduceRightAsync([], () => {}, () => {});
      }).to.throw(TypeError, /empty array with no initial value/);
    });
  });

  describe('iterator', () => {

    it('should immediately return the first value in the array if the array has a length of 1 and the accumulator is called without an initial value', done => {
      const _arr = ['foo'];

      reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
        const err = new Error('iteratee should not be called');
        done(err);
      }, result => {
        expect(result).to.equal(_arr[0]);
        done();
      });
    });

    it('should wait until the current iteration invokes the "next" callback before iterating to the next step', done => {
      const _arr = ['foo', 'bar', 'baz', 'qux'];
      const _len = _arr.length;
      const _delay = 250;
      const _startTime = new Date();

      reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
        setTimeout(() => {
          const _stepTime = new Date();
          const _deltaTime = _stepTime - _startTime;

          expect(_deltaTime).to.be.at.least(_delay * (_len - n - 1)).and.to.be.below(_delay * (_len - n));
          next();
        }, _delay);
      }, result => {
        const _endTime = new Date();
        const _deltaTime = _endTime - _startTime;

        expect(_deltaTime).to.be.above((_len - 1) * _delay).and.below(_len * _delay);
        done();
      });
    });
  });

  describe('iteratee', () => {

    describe('prev', () => {

      it('should be equal to the last value in the array during the first step if no initial value is specified', done => {
        const _arr = ['foo', 'bar', 'baz', 'qux'];
        const _len = _arr.length;
        let _step = 0;

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step++ === 0) {
            expect(prev).to.equal(_arr[_len - 1]);
          }

          next();
        }, result => {
          done();
        });
      });

      it('should be equal to the initial value during the first step if it is specified', done => {
        const _arr = ['foo', 'bar', 'baz', 'qux'];
        const _initialValue = 'foo';
        let _step = 0;

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step++ === 0) {
            expect(prev).to.equal(_initialValue);
          }

          next();
        }, result => {
          done();
        }, _initialValue);
      });

      it('should be equal to the value passed into the "next" function of the previous step', done => {
        const _arr = ['foo', 'baz', 'baz'];
        const _len = _arr.length;
        let _step = 0;

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step === 0) {
            expect(prev).to.equal(_arr[_len - 1]);
          } else {
            expect(prev).to.equal(_step);
          }

          next(++_step);
        }, result => {
          done();
        });
      });
    });

    describe('curr', () => {

      it('should be equal to the second-to-last value in the array during the first step if no initial value is specified', done => {
        const _arr = ['foo', 'bar', 'baz', 'qux'];
        const _len = _arr.length;
        let _step = 0;

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step++ === 0) {
            expect(curr).to.equal(_arr[_len - 2]);
          }

          next();
        }, result => {
          done();
        });
      });

      it('should be equal to the lsat value in the array during the first step if an initial value is specified', done => {
        const _arr = ['foo', 'bar', 'baz', 'qux'];
        const _len = _arr.length;
        const _initialValue = 'foo';
        let _step = 0;

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          if (_step++ === 0) {
            expect(curr).to.equal(_arr[_len - 1]);
          }

          next();
        }, result => {
          done();
        }, _initialValue);
      });
    });

    describe('n', () => {

      it('should start at the second-to-last index if no initial value is specified', done => {
        const _arr = ['foo', 'bar', 'baz', 'qux'];
        const _len = _arr.length;
        let _step = 0;

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          expect(n).to.equal((_len - 1) - (++_step));
          next();
        }, result => {
          done();
        });
      });

      it('should start at the last index if an initial value is specified', done => {
        const _arr = ['bar', 'baz', 'qux'];
        const _len = _arr.length;
        const _initialValue = 'foo';
        let _step = 0;

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          expect(n).to.equal((_len - 1) - (_step++));
          next();
        }, result => {
          done();
        }, _initialValue);
      });
    });

    describe('arr', () => {

      it('should be equal to the given array', done => {
        const _arr = ['foo', 'bar', 'baz', 'qux'];

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          expect(arr).to.deep.equal(_arr);
          next();
        }, result => {
          done();
        });
      });

      it('should be equal to the given array without the initial value when specified', done => {
        const _arr = ['foo', 'bar', 'baz', 'qux'];
        const _initialValue = 'foo';

        reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
          expect(arr).to.deep.equal(_arr);
          next();
        }, result => {
          done();
        }, _initialValue);
      });
    });
  });

  describe('done', () => {

    it('should be called with the results of the reduce', done => {
      const _arr = ['foo', 'bar', 'baz', 'qux'];

      reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
        next(prev + curr);
      }, result => {
        expect(result).to.equal('quxbazbarfoo');
        done();
      });
    });

    it('should be called with the results of the reduce when an initial value is specified', done => {
      const _arr = ['foo', 'bar', 'baz'];
      const _initialValue = 'qux';

      reduceRightAsync(_arr, (prev, curr, n, arr, next) => {
        next(prev + curr);
      }, result => {
        expect(result).to.equal('quxbazbarfoo');
        done();
      }, _initialValue);
    });
  });
});
