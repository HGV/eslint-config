type Checker<T> = (value: T) => boolean;

export const and = <T>(...conditions: Checker<T>[]): Checker<T> => {
  return (value) => {
    for (const condition of conditions) {
      if (!condition(value)) {
        return false;
      }
    }
    return true;
  };
};

export const or = <T>(...conditions: Checker<T>[]): Checker<T> => {
  return (value) => {
    for (const condition of conditions) {
      if (condition(value)) {
        return true;
      }
    }
    return false;
  };
};

export const not = <T>(condition: Checker<T>): Checker<T> => {
  return (value) => {
    return !condition(value);
  };
};

export const createCheckers = <T>() => {
  return <ConditionSet extends Record<string, Checker<T>>>(
    conditions: ConditionSet
  ) => {
    return conditions;
  };
};
