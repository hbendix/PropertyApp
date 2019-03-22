export interface Area {
    postcode: string;
    broadband: InternetStats;
    gas: GasElectric;
    electricity: GasElectric;
    crime: CrimeStats[];
    avgPrice: number;
}

export interface InternetStats {
    super_fast: number;    
    avg_download: number;
    min_download: number;
    max_download: number;
    avg_upload: number;
    min_upload: number;
    max_upload: number;
}

export interface GasElectric {
    consumption: number;
    meter_count: number;
}

export interface CrimeStats {
    type: string;
    location: string;
}