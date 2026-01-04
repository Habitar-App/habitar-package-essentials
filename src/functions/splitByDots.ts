export function splitByDots(field: string = "", value: any) {
  const fieldSplitted = field.split(".");
  let object: Record<string, any> = {};
  fieldSplitted.reduce((previous, current, currentIndex) => {
    if (currentIndex === fieldSplitted.length - 1)
      return (previous[current] = value);
    return (previous[current] = {});
  }, object);
  return object;
}
