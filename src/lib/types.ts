export interface ScanResult {
    items: ScanItem[];
    meta?: unknown;
}

export type ScanItemType = "TODO";

export interface ScanItem {
    type: ScanItemType;
    content: string;
    code: string;
    path: string;
    line: number;
    url: string;
}
