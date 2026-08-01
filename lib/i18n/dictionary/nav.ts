type NavItemCopy = { label: string; description: string };

export type NavDict = {
  sections: {
    main: string;
    baby: string;
    discover: string;
    elite: string;
    family: string;
    account: string;
  };
  items: {
    home: NavItemCopy;
    askPilu: NavItemCopy;
    timeline: NavItemCopy;
    quickAdd: NavItemCopy;
    babyProfile: NavItemCopy;
    feeding: NavItemCopy;
    sleep: NavItemCopy;
    diapers: NavItemCopy;
    growth: NavItemCopy;
    milestones: NavItemCopy;
    vaccines: NavItemCopy;
    medicine: NavItemCopy;
    library: NavItemCopy;
    firstAid: NavItemCopy;
    solidFoods: NavItemCopy;
    memoryBook: NavItemCopy;
    sleepSounds: NavItemCopy;
    reports: NavItemCopy;
    vision: NavItemCopy;
    smartRoutines: NavItemCopy;
    family: NavItemCopy;
    notifications: NavItemCopy;
    settings: NavItemCopy;
    subscription: NavItemCopy;
    help: NavItemCopy;
  };
  gates: {
    sleepSounds: { title: string; description: string };
    reports: { title: string; description: string };
  };
};
