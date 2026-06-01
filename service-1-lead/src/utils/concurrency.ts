export const runWithConcurrency = async <T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<PromiseSettledResult<T>[]> => {
  const results: PromiseSettledResult<T>[] = [];
  const queue = [...tasks];
  const inFlight = new Set<Promise<unknown>>();

  return new Promise((resolve) => {
    const tryNext = () => {
      while (inFlight.size < limit && queue.length > 0) {
        const task = queue.shift()!;
        const p: Promise<unknown> = task()
          .then((val) => results.push({ status: "fulfilled", value: val }))
          .catch((err) => results.push({ status: "rejected", reason: err }))
          .finally(() => {
            inFlight.delete(p);
            tryNext();
            if (inFlight.size === 0 && queue.length === 0) resolve(results);
          });
        inFlight.add(p);
      }
    };

    tryNext();
    if (tasks.length === 0) resolve(results);
  });
};
