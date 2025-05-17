export interface DashboardStaticData {
  green: {
    date: string;
    perCapita: number;
    accessiblePerCapita: number;
  };
  air: {
    latestYearAverage: number;
  };
  waste: {
    nationwidePerCapita: {[year: string]: number};
  };
}
