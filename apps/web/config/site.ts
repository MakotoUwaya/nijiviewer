export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "NijiViewer",
  description: "Get addicted to Nijisanji's swamp.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Live Videos",
      href: "/live-videos/Nijisanji",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Live Videos",
      href: "/live-videos/Nijisanji",
    },
  ],
  links: {
    github: "https://github.com/MakotoUwaya/nijiviewer",
    docs: "https://docs.mukwty.com",
  },
};
