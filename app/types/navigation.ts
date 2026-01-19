export interface NavItem {
  href: string;
  label: string;
}

export interface NavigationData {
  items: NavItem[];
  cta: {
    href: string;
    label: string;
  };
}
