export const getPosition = (position: number, i: (id: string) => string) => {
  const ranges = [
    { min: 100, max: Infinity, full: i("spectrum.farRight"), short: "RR" },
    { min: 75, max: 99, full: i("spectrum.rightWing"), short: "Rr" },
    { min: 50, max: 74, full: i("spectrum.centreRight"), short: "rr" },
    { min: 25, max: 49, full: i("spectrum.leanRight"), short: "r" },
    { min: -24, max: 24, full: i("spectrum.centre"), short: "C" },
    { min: -49, max: -25, full: i("spectrum.leanLeft"), short: "l" },
    { min: -74, max: -50, full: i("spectrum.centreLeft"), short: "ll" },
    { min: -99, max: -75, full: i("spectrum.leftWing"), short: "Ll" },
    { min: -Infinity, max: -100, full: i("spectrum.farLeft"), short: "LL" },
  ];

  const match = ranges.find(
    (range) => position >= range.min && position <= range.max,
  );

  return match || { full: "Centre", short: "C" };
};
