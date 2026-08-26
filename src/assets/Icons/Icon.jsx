const PATHS = {
    home: <><path d="M4 11 12 4l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>,
    pill: <><rect x="5" y="3" width="14" height="18" rx="7" transform="rotate(45 12 12)" /><path d="m8.5 8.5 7 7" /></>,
    activity: <path d="M3 12h4l2 7 4-14 2 7h6" />,
    clipboard: <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 11h6M9 15h6" /></>,
    sparkles: <path d="M12 3v4M12 17v4M4 12h4M16 12h4M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />,
    file: <><path d="M7 3h9l4 4v14H7z" /><path d="M16 3v4h4" /><path d="M10 12h6M10 16h6" /></>,
    "bar-chart": <path d="M5 21V10M12 21V4M19 21v-7" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4 10-10" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
    edit: <><path d="m4 20 4.2-1 9.9-9.9a2.1 2.1 0 0 0-3-3L5.2 16z" /><path d="m13.8 7.2 3 3" /></>,
    trash: <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />,
    whatsapp: <><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L4 20l1-3.7a8.5 8.5 0 1 1 15.5-4.6Z" /><path d="M9 8.5c.2-.5.5-.6.8-.6h.6c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.7.8c.8 1.3 1.8 2.2 3.2 2.8l.7-.8c.2-.2.4-.2.7-.1l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.2-.6 1.4" /></>,
    history: <><path d="M4 12a8 8 0 1 0 2.3-5.7" /><path d="M4 5v5h5M12 7v5l3 2" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 10v6M12 7.2h.01" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.3-4.3" /></>,
    pin: <><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    inbox: <><path d="M4 12h4l2 3h4l2-3h4" /><path d="M5 12 6 5h12l1 7" /><path d="M4 12v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" /></>,
};

export function Icon({ name, size = 20 }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {PATHS[name]}
        </svg>
    );
}

export default Icon;