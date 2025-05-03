export type DashboardStatistics = {
  totalUsers: number;
  totalFaculties: number;
  totalContributions: number;
  totalStudentAdmissions: number;
  activeUsers: number;
  recentSubmissions: number;
  totalEvents: number;
  totalComments: number;
};


export type BrowserUsage = {
  _count: {
    browser_name: number;
    user_id: number;
  };
  browser_name: string;
  browser_version: string;
  user_id: number;
  percentage: string;
  user: string;
};

export type BrowserUsageResponse = {
  browserUsages: BrowserUsage[];
  browserUsagesWithPercentage: BrowserUsage[];
  browserUsageByUser: BrowserUsage[];
  browserUsageByUserWithPercentage: BrowserUsage[];
};

export type BrowserUsageData = {
  browserUsages: BrowserUsage[];
}