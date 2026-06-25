/**
 * ESM shim for promise-limit (originally CommonJS).
 * The original package uses module.exports which is incompatible
 * with the rolldown bundler used by Astro 7 + Cloudflare adapter.
 * This file re-implements the same API as an ES module.
 */

function limiter(count) {
  var outstanding = 0;
  var jobs = [];

  function remove() {
    outstanding--;
    if (outstanding < count) {
      dequeue();
    }
  }

  function dequeue() {
    var job = jobs.shift();
    semaphore.queue = jobs.length;
    if (job) {
      run(job.fn).then(job.resolve).catch(job.reject);
    }
  }

  function queue(fn) {
    return new Promise(function (resolve, reject) {
      jobs.push({ fn: fn, resolve: resolve, reject: reject });
      semaphore.queue = jobs.length;
    });
  }

  function run(fn) {
    outstanding++;
    try {
      return Promise.resolve(fn()).then(
        function (result) {
          remove();
          return result;
        },
        function (error) {
          remove();
          throw error;
        }
      );
    } catch (err) {
      remove();
      return Promise.reject(err);
    }
  }

  var semaphore = function (fn) {
    if (outstanding >= count) {
      return queue(fn);
    } else {
      return run(fn);
    }
  };

  return semaphore;
}

function map(items, mapper) {
  var failed = false;
  var limit = this;

  return Promise.all(
    items.map(function () {
      var args = arguments;
      return limit(function () {
        if (!failed) {
          return mapper.apply(undefined, args).catch(function (e) {
            failed = true;
            throw e;
          });
        }
      });
    })
  );
}

function addExtras(fn) {
  fn.queue = 0;
  fn.map = map;
  return fn;
}

export default function promiseLimit(count) {
  if (count) {
    return addExtras(limiter(count));
  } else {
    return addExtras(function (fn) {
      return fn();
    });
  }
}
