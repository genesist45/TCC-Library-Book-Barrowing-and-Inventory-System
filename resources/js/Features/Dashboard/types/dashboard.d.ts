/**
 * Dashboard Feature Types
 * Types specific to the Dashboard feature
 */

export interface Author {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface NewArrivalItem {
    id: number;
    title: string;
    accession_no?: string;
    isbn?: string;
    isbn13?: string;
    cover_image?: string;
    type?: string;
    created_at: string;
    authors?: Author[];
    category?: Category;
}

export interface CheckoutItem {
    id: number;
    member_id: number;
    member_name: string;
    member_no: string;
    catalog_item_id: number;
    book_title: string;
    cover_image?: string;
    accession_no?: string;
    due_date: string;
    date_borrowed: string;
    is_overdue: boolean;
}

export interface PeriodData {
    current: number;
    previous: number;
}

export interface GraphDataPoint {
    label: string;
    date: string;
    value: number;
}

export interface FullPeriodData {
    current: number;
    previous: number;
    graphData: GraphDataPoint[];
}

export interface StatData {
    total: number;
    periodData: {
        current: FullPeriodData;
        day: FullPeriodData;
        week: FullPeriodData;
        month: FullPeriodData;
        year: FullPeriodData;
    };
}

export interface ChartDataPoint {
    label: string;
    titles: number;
    members: number;
    checkouts: number;
}

export interface DashboardStats {
    titles: StatData;
    members: StatData;
    checkouts: StatData;
    users: StatData;
}

export interface DashboardProps {
    stats: DashboardStats;
    newArrivals: NewArrivalItem[];
    activeCheckouts: CheckoutItem[];
    comparisonChartData?: ChartDataPoint[];
}
