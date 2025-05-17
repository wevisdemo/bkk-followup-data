export interface DashboardStaticData {
  green: {
    date: string;
    perCapita: number;
    accessiblePerCapita: number;
    standard: number;
  };
  water: {
    standard: number;
  };
  air: {
    latestYearAverage: number;
    standard: number;
  };
  waste: {
    nationwidePerCapita: {[year: string]: number};
  };
}
