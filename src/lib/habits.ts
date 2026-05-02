export const habitFrequencyOptions = [
  { value: 7, label: "Every day", hint: "Best for daily habits like exercise or journaling." },
  { value: 5, label: "5 times a week", hint: "Useful for workday habits." },
  { value: 3, label: "3 times a week", hint: "Good for moderate routines." },
  { value: 2, label: "2 times a week", hint: "Useful for lower-frequency habits." },
  { value: 1, label: "Once a week", hint: "For weekly resets or reviews." },
] as const;

export function getHabitFrequencyLabel(targetFrequency: number) {
  const matchedOption = habitFrequencyOptions.find((option) => option.value === targetFrequency);
  if (matchedOption) {
    return matchedOption.label;
  }

  return targetFrequency === 1 ? "Once a week" : `${targetFrequency} times a week`;
}
