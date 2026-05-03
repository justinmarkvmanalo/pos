export function NavIcon({
  icon,
  className = "h-5 w-5",
}: {
  icon: "dashboard" | "goals" | "habits" | "capture" | "review" | "profile" | "logout";
  className?: string;
}) {
  const sharedProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (icon) {
    case "dashboard":
      return (
        <svg {...sharedProps}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case "goals":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 4v2.5M20 12h-2.5M12 20v-2.5M4 12h2.5" />
        </svg>
      );
    case "habits":
      return (
        <svg {...sharedProps}>
          <path d="M12 21c4-2.5 7-6.1 7-10a4 4 0 0 0-7-2.4A4 4 0 0 0 5 11c0 3.9 3 7.5 7 10Z" />
        </svg>
      );
    case "capture":
      return (
        <svg {...sharedProps}>
          <path d="M4 5h16v14H4z" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      );
    case "review":
      return (
        <svg {...sharedProps}>
          <path d="M6 4h9l3 3v13H6z" />
          <path d="M15 4v4h4" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );
    case "profile":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.7-3.4 4.2-5 7-5s5.3 1.6 7 5" />
        </svg>
      );
    case "logout":
      return (
        <svg {...sharedProps}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H4" />
          <path d="M20 20V4" />
        </svg>
      );
  }
}
