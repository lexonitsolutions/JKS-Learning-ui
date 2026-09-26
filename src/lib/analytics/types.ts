export interface MetricDelta {
  value: number;
  previousValue: number;
  changePercent: number;
}

export interface GA4Overview {
  activeUsers: MetricDelta;
  newUsers: MetricDelta;
  sessions: MetricDelta;
  pageViews: MetricDelta;
  averageSessionDurationSeconds: MetricDelta;
  bounceRate: MetricDelta;
}

export interface TimeseriesPoint {
  date: string;
  label: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
}

export interface TrafficSourceItem {
  source: string;
  medium: string;
  sessions: number;
  activeUsers: number;
  percentage: number;
}

export interface TopPageItem {
  path: string;
  title: string;
  pageViews: number;
  activeUsers: number;
}

export interface DeviceItem {
  device: string;
  activeUsers: number;
  sessions: number;
  percentage: number;
}

export interface GeographyItem {
  country: string;
  activeUsers: number;
  sessions: number;
  percentage: number;
}

export interface EventItem {
  eventName: string;
  isJksCustom: boolean;
  eventCount: number;
  totalUsers: number;
}

export interface RealtimeData {
  activeUsersLast30Min: number;
  topPages: { path: string; activeUsers: number }[];
  topCountries: { country: string; activeUsers: number }[];
  topCities: { city: string; activeUsers: number }[];
}

export interface GA4DashboardPayload {
  configured: boolean;
  hasData: boolean;
  propertyId?: string;
  dateRange: {
    range: string;
    startDate: string;
    endDate: string;
  };
  cachedAt: string;
  overview: GA4Overview;
  timeseries: TimeseriesPoint[];
  trafficSources: TrafficSourceItem[];
  topPages: TopPageItem[];
  devices: DeviceItem[];
  geography: GeographyItem[];
  customEvents: EventItem[];
  realtime: RealtimeData;
}
