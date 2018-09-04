export const wrappedPromise = () => {
  const wrappedPromise = {};
  const promise = new Promise((resolve, reject) => {
    wrappedPromise.resolve = resolve;
    wrappedPromise.reject = reject;
  });

  wrappedPromise.then = promise.then.bind(promise);
  wrappedPromise.catch = promise.catch.bind(promise);
  wrappedPromise.promise = promise;

  return wrappedPromise;
}
