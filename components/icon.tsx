import React from "react";
import {
  Facebook,
  GitHub,
  Instagram,
  Language,
  LibraryBooks,
  LinkedIn,
  Mail,
  OpenInNew,
  Pinterest,
  Reddit,
  School,
  Science,
  Twitter,
  WhatsApp,
  YouTube,
  // Additional icons
  Work,
  Home,
  Phone,
  LocationOn,
  Build,
  Code,
  Computer,
  Person,
  Group,
  Star,
  Favorite,
  ThumbUp,
  TrendingUp,
  Timeline,
  Assessment,
  BarChart,
  PieChart,
  ShowChart,
  MonetizationOn,
  AccountBalance,
  CreditCard,
  Business,
  LocalShipping,
  Flight,
  DirectionsCar,
  Train,
  Hotel,
  Restaurant,
  LocalCafe,
  MusicNote,
  Movie,
  SportsEsports,
  Brush,
  Camera,
  PhotoCamera,
  Palette,
  ColorLens,
  Create,
  Edit,
  AutoFixHigh,
  Settings,
  Security,
  Lock,
  VpnKey,
  Visibility,
  Search,
  CloudDownload,
  CloudUpload,
  Storage,
  Memory,
  Speed,
  Timer,
  Schedule,
  Event,
  DateRange,
  Today,
  AccessTime,
  Alarm,
  Email,
  Message,
  Chat,
  Forum,
  Explore,
  Map,
  Place,
  Navigation,
  MyLocation,
  Directions,
  MenuBook,
  Assignment,
  Description,
  Article,
  Note,
  Bookmark,
  Dashboard,
  Analytics,
  Psychology,
  Lightbulb,
  EmojiObjects,
  Rocket,
  Launch,
  OpenInBrowser,
  Link,
  Share,
  Download,
  Upload,
  Save,
  Print,
  FileCopy,
  Folder,
  InsertDriveFile
} from "@mui/icons-material";

export const SUPPORTED_ICONS: {
  [key: string]: {
    name: string;
    component: () => React.ReactElement;
  };
} = {
  gitHub: {
    name: "GitHub",
    component: () => <GitHub />,
  },
  externalLink: {
    name: "External link",
    component: () => <OpenInNew />,
  },
  globe: {
    name: "Globe",
    component: () => <Language />,
  },
  mail: {
    name: "Mail",
    component: () => <Mail />,
  },
  instagram: {
    name: "Instagram",
    component: () => <Instagram />,
  },
  facebook: {
    name: "Facebook",
    component: () => <Facebook />,
  },
  linkedIn: {
    name: "LinkedIn",
    component: () => <LinkedIn />,
  },
  libraryBooks: {
    name: "Library Books",
    component: () => <LibraryBooks />,
  },
  twitter: {
    name: "Twitter",
    component: () => <Twitter />,
  },
  translate: {
    name: "Translate",
    component: () => <Language />,
  },
  youTube: {
    name: "YouTube",
    component: () => <YouTube />,
  },
  pinterest: {
    name: "Pinterest",
    component: () => <Pinterest />,
  },
  reddit: {
    name: "Reddit",
    component: () => <Reddit />,
  },
  school: {
    name: "School",
    component: () => <School />,
  },
  science: {
    name: "Science",
    component: () => <Science />,
  },
  whatsApp: {
    name: "WhatsApp",
    component: () => <WhatsApp />,
  },
  // Work & Professional
  work: {
    name: "Work",
    component: () => <Work />,
  },
  business: {
    name: "Business",
    component: () => <Business />,
  },
  build: {
    name: "Build/Tools",
    component: () => <Build />,
  },
  code: {
    name: "Code",
    component: () => <Code />,
  },
  computer: {
    name: "Computer",
    component: () => <Computer />,
  },
  settings: {
    name: "Settings",
    component: () => <Settings />,
  },
  // Contact & Location
  home: {
    name: "Home",
    component: () => <Home />,
  },
  phone: {
    name: "Phone",
    component: () => <Phone />,
  },
  email: {
    name: "Email",
    component: () => <Email />,
  },
  locationOn: {
    name: "Location",
    component: () => <LocationOn />,
  },
  map: {
    name: "Map",
    component: () => <Map />,
  },
  place: {
    name: "Place",
    component: () => <Place />,
  },
  // People & Social
  person: {
    name: "Person",
    component: () => <Person />,
  },
  group: {
    name: "Group",
    component: () => <Group />,
  },
  message: {
    name: "Message",
    component: () => <Message />,
  },
  chat: {
    name: "Chat",
    component: () => <Chat />,
  },
  forum: {
    name: "Forum",
    component: () => <Forum />,
  },
  // Performance & Analytics
  star: {
    name: "Star",
    component: () => <Star />,
  },
  trendingUp: {
    name: "Trending Up",
    component: () => <TrendingUp />,
  },
  assessment: {
    name: "Assessment",
    component: () => <Assessment />,
  },
  barChart: {
    name: "Bar Chart",
    component: () => <BarChart />,
  },
  pieChart: {
    name: "Pie Chart",
    component: () => <PieChart />,
  },
  showChart: {
    name: "Line Chart",
    component: () => <ShowChart />,
  },
  timeline: {
    name: "Timeline",
    component: () => <Timeline />,
  },
  dashboard: {
    name: "Dashboard",
    component: () => <Dashboard />,
  },
  analytics: {
    name: "Analytics",
    component: () => <Analytics />,
  },
  // Finance & Money
  monetizationOn: {
    name: "Money",
    component: () => <MonetizationOn />,
  },
  accountBalance: {
    name: "Bank",
    component: () => <AccountBalance />,
  },
  creditCard: {
    name: "Credit Card",
    component: () => <CreditCard />,
  },
  // Travel & Transportation
  flight: {
    name: "Flight",
    component: () => <Flight />,
  },
  directionsCar: {
    name: "Car",
    component: () => <DirectionsCar />,
  },
  train: {
    name: "Train",
    component: () => <Train />,
  },
  localShipping: {
    name: "Shipping",
    component: () => <LocalShipping />,
  },
  hotel: {
    name: "Hotel",
    component: () => <Hotel />,
  },
  // Food & Lifestyle
  restaurant: {
    name: "Restaurant",
    component: () => <Restaurant />,
  },
  localCafe: {
    name: "Coffee",
    component: () => <LocalCafe />,
  },
  // Entertainment & Media
  musicNote: {
    name: "Music",
    component: () => <MusicNote />,
  },
  movie: {
    name: "Movie",
    component: () => <Movie />,
  },
  sportsEsports: {
    name: "Gaming",
    component: () => <SportsEsports />,
  },
  camera: {
    name: "Camera",
    component: () => <Camera />,
  },
  photoCamera: {
    name: "Photo Camera",
    component: () => <PhotoCamera />,
  },
  // Creative & Design
  brush: {
    name: "Brush",
    component: () => <Brush />,
  },
  palette: {
    name: "Palette",
    component: () => <Palette />,
  },
  colorLens: {
    name: "Color Lens",
    component: () => <ColorLens />,
  },
  create: {
    name: "Create",
    component: () => <Create />,
  },
  edit: {
    name: "Edit",
    component: () => <Edit />,
  },
  autoFixHigh: {
    name: "Auto Fix",
    component: () => <AutoFixHigh />,
  },
  // Innovation & Ideas
  lightbulb: {
    name: "Lightbulb",
    component: () => <Lightbulb />,
  },
  emojiObjects: {
    name: "Ideas",
    component: () => <EmojiObjects />,
  },
  psychology: {
    name: "Psychology",
    component: () => <Psychology />,
  },
  rocket: {
    name: "Rocket",
    component: () => <Rocket />,
  },
  // Security
  security: {
    name: "Security",
    component: () => <Security />,
  },
  lock: {
    name: "Lock",
    component: () => <Lock />,
  },
  vpnKey: {
    name: "Key",
    component: () => <VpnKey />,
  },
  // Search & Navigation
  search: {
    name: "Search",
    component: () => <Search />,
  },
  visibility: {
    name: "Visibility",
    component: () => <Visibility />,
  },
  explore: {
    name: "Explore",
    component: () => <Explore />,
  },
  navigation: {
    name: "Navigation",
    component: () => <Navigation />,
  },
  directions: {
    name: "Directions",
    component: () => <Directions />,
  },
  myLocation: {
    name: "My Location",
    component: () => <MyLocation />,
  },
  // Documents & Files
  assignment: {
    name: "Assignment",
    component: () => <Assignment />,
  },
  description: {
    name: "Description",
    component: () => <Description />,
  },
  article: {
    name: "Article",
    component: () => <Article />,
  },
  note: {
    name: "Note",
    component: () => <Note />,
  },
  menuBook: {
    name: "Book",
    component: () => <MenuBook />,
  },
  bookmark: {
    name: "Bookmark",
    component: () => <Bookmark />,
  },
  folder: {
    name: "Folder",
    component: () => <Folder />,
  },
  insertDriveFile: {
    name: "File",
    component: () => <InsertDriveFile />,
  },
  fileCopy: {
    name: "Copy",
    component: () => <FileCopy />,
  },
  // Time & Scheduling
  schedule: {
    name: "Schedule",
    component: () => <Schedule />,
  },
  event: {
    name: "Event",
    component: () => <Event />,
  },
  dateRange: {
    name: "Date Range",
    component: () => <DateRange />,
  },
  today: {
    name: "Today",
    component: () => <Today />,
  },
  accessTime: {
    name: "Time",
    component: () => <AccessTime />,
  },
  timer: {
    name: "Timer",
    component: () => <Timer />,
  },
  alarm: {
    name: "Alarm",
    component: () => <Alarm />,
  },
  // Cloud & Storage
  cloudDownload: {
    name: "Download",
    component: () => <CloudDownload />,
  },
  cloudUpload: {
    name: "Upload",
    component: () => <CloudUpload />,
  },
  storage: {
    name: "Storage",
    component: () => <Storage />,
  },
  memory: {
    name: "Memory",
    component: () => <Memory />,
  },
  speed: {
    name: "Speed",
    component: () => <Speed />,
  },
  // Actions
  thumbUp: {
    name: "Thumb Up",
    component: () => <ThumbUp />,
  },
  favorite: {
    name: "Favorite",
    component: () => <Favorite />,
  },
  share: {
    name: "Share",
    component: () => <Share />,
  },
  download: {
    name: "Download",
    component: () => <Download />,
  },
  upload: {
    name: "Upload",
    component: () => <Upload />,
  },
  save: {
    name: "Save",
    component: () => <Save />,
  },
  print: {
    name: "Print",
    component: () => <Print />,
  },
  launch: {
    name: "Launch",
    component: () => <Launch />,
  },
  openInBrowser: {
    name: "Open in Browser",
    component: () => <OpenInBrowser />,
  },
  link: {
    name: "Link",
    component: () => <Link />,
  },
};

// Define icon categories with priority order
const ICON_CATEGORIES = {
  // 1. Most common job-related icons (highest priority)
  jobEssentials: ['work', 'business', 'person', 'phone', 'email', 'locationOn', 'home'],

  // 2. Technology & Skills
  tech: ['code', 'computer', 'build', 'settings', 'github', 'linkedIn'],

  // 3. Professional & Analytics
  professional: ['assessment', 'barChart', 'trendingUp', 'timeline', 'dashboard', 'analytics', 'star'],

  // 4. Communication & Social
  communication: ['message', 'chat', 'forum', 'share', 'link'],

  // 5. Creative & Design
  creative: ['brush', 'palette', 'create', 'edit', 'lightbulb', 'rocket'],

  // 6. Documents & Learning
  documents: ['assignment', 'article', 'note', 'menuBook', 'bookmark', 'school', 'libraryBooks'],

  // 7. Everything else
  other: [] // Will be filled automatically with remaining icons
};

// Create prioritized icon list
const createPrioritizedIconList = () => {
  const allIconKeys = Object.keys(SUPPORTED_ICONS);
  const prioritizedKeys: string[] = [];
  const usedKeys = new Set<string>();

  // Add icons in category order
  Object.values(ICON_CATEGORIES).forEach(categoryKeys => {
    categoryKeys.forEach(key => {
      if (SUPPORTED_ICONS[key] && !usedKeys.has(key)) {
        prioritizedKeys.push(key);
        usedKeys.add(key);
      }
    });
  });

  // Add remaining icons
  allIconKeys.forEach(key => {
    if (!usedKeys.has(key)) {
      prioritizedKeys.push(key);
    }
  });

  return prioritizedKeys.map(key => ({
    name: SUPPORTED_ICONS[key].name,
    key
  }));
};

export const supportedIconNames = createPrioritizedIconList();
