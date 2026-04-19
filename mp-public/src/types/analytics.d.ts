interface Window {
    gtag: (
        command: 'config' | 'event' | 'js',
        targetId: string,
        config?: ControlParams | EventParams | ConfigParams | CustomParams
    ) => void;
    dataLayer: any[];
    fbq: (
        command: string,
        eventName: string,
        options?: any
    ) => void;
    _fbq: any;
}

type ControlParams = {
    groups?: string | string[];
    send_to?: string | string[];
    event_callback?: () => void;
    event_timeout?: number;
};

type EventParams = {
    checkout_option?: string;
    checkout_step?: number;
    content_id?: string;
    content_type?: string;
    coupon?: string;
    currency?: string;
    description?: string;
    fatal?: boolean;
    items?: any[];
    method?: string;
    number?: string;
    promotions?: any[];
    screen_name?: string;
    search_term?: string;
    shipping?: number;
    tax?: number;
    transaction_id?: string;
    value?: number;
    event_label?: string;
    event_category?: string;
};

type ConfigParams = {
    page_title?: string;
    page_location?: string;
    page_path?: string;
    send_page_view?: boolean;
};

type CustomParams = {
    [key: string]: any;
};
