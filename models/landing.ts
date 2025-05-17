export interface Landing {
  latestYear: {
    year: number;
    budget: number;
    population: number;
    budgetPerCapita: number;
  };
  yearCount: number;
  
  budgetPerCapita: {year: number, value: number }[];
  totalBudget: number;
  yearlyBudgetSummaries: YearlyBudgetSummary[];
}

export interface YearlyBudgetSummary {
  year: number;
  values: [
    {
      title: "การศึกษา";
      value: number;
    },
    {
      title: "สาธารณสุข";
      value: number;
    },
    {
      title: "พัฒนาสังคมและชุมชนเมือง";
      value: number;
    },
    {
      title: "ทรัพยากรธรรมชาติและสิ่งแวดล้อม";
      value: number;
    },
    {
      title: "เมืองและการพัฒนาเมือง";
      value: number;
    },
    {
      title: "ความปลอดภัยและความเป็นระเบียบเรียบร้อย";
      value: number;
    },
    {
      title: "การบริหารจัดการและบริหารราชการ";
      value: number;
    },
        {
      title: "เศรษฐกิจและการพาณิชย์";
      value: number;
    },
  ];
};