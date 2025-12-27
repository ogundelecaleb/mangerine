import { NavigatorScreenParams } from '@react-navigation/native';

// Types for different entities in the app
export interface User {
  fullName: string;
  email: string;
  businessName?: string;
  location?: string;
  password?: string;
  interests?: Interest[];
  userType?: UserType;
  websiteAddress?: string | null;
  mobileNumber?: string | null;
  secondaryNumber?: string | null;
  postalAddress?: string | null;
  dateOfBirth?: string | null;
  title?: string | null;
  profilePics?: string | null;
  profilePicsId?: string | null;
  profileBanner?: string | null;
  profileBannerId?: string | null;
  resume?: string | null;
  videoIntro?: string | null;
  bio?: string | null;
  isConsultant?: boolean;
  videoIntroPubId?: string | null;
  messagingPreference?: string;
  id: string;
  step?: number;
  authType?: string;
  pricingPlan?: string;
  billingCycle?: string;
  isVerified?: boolean;
  isActive?: boolean;
  regComplete?: boolean;
  followerCount?: number;
  createdAt: string;
  updatedAt: string;
  appearInSearchResults?: boolean;
  emailVisible?: boolean;
  websiteVisible?: boolean;
  phoneVisible?: boolean;
}

export interface UserType {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interest {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  school_name: string;
  degree: string;
  field_of_study: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  isCurrent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  title: string;
  employment_type: string;
  company_name: string;
  location: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  isCurrent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultancy {
  id: string;
  title: string;
  description: string;
  hours: number;
  file: string;
  file_public_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultant extends User {
  title?: string;
  specialization?: string;
  hourlyRate?: number;
  // Add more consultant-specific properties
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  // Add more post properties
}

export interface Appointment {
  id: string;
  consultant: Consultant;
  user: User;
  scheduledAt: string;
  consultantId: string;
  userId: string;
  availabilityId: string;
  message: string;
  videoOption: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  timeslots: [
    {
      id: string;
      startTime: string;
      endTime: string;
      duration: number;
      isBooked: boolean;
    },
  ];
  availability: {
    id: string;
    date: string;
    isRecurring: boolean;
  };
}

export interface Availability {
  id: string;
  date: string;
  isRecurring: boolean;
  timeslots: {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    isBooked: boolean;
  }[];
}

export interface ErrorData {
  error: {
    status: number;
    data: {
      message: string;
      error: string;
      statusCode: number;
    };
  };
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: string;
  // Add more conversation properties
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  // Add more group properties
}

export interface MiniGroup {
  id: string;
  name: string;
  memberCount: number;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  url?: string;
  // Add more work properties
}

// Main navigation stack - all screens in the app
export type MainStack = {
  // Authentication screens
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  FinishRegistration: {
    email: string;
    password: string;
    fullName: string;
  };
  SignupAvatar: undefined;
  SignupResume: undefined;
  ForgotPassword: undefined;
  SignupOTP: {
    email: string;
    password: string;
    fullName: string;
  };
  ForgotPasswordOTP: {
    email: string;
    otpHash?: string;
  };
  ResetPassword: {
    email: string;
  };

  // Main app with bottom tabs
  Tabs: NavigatorScreenParams<BottomTabList>;

  // Post-related screens
  CreatePost?: {
    groupId?: string;
    post?: Post;
  };
  EditPost: {
    post: Post;
  };
  PostDetails: {
    post: Post;
  };

  // Profile screens
  Profile: {
    user?: User | Consultant;
    userId?: string;
  };
  ViewProfile: {
    user?: User | Consultant;
    userId?: string;
  };
  EditProfile: undefined;
  UserPosts?: {
    posts?: Post[];
  };
  UserWorks?: {
    works?: Work[];
  };
  UserFollowing: {
    user: User;
    users: User[];
  };
  UserFollowers: {
    user: User;
    users: User[];
  };

  // Work and skills management
  AddWork?: {
    url?: string;
    work?: Work;
  };
  ManageSkills: undefined;
  ManageEducation: undefined;
  ManageExperience: undefined;
  ManageLanguages: undefined;
  UpdateContact: undefined;

  // Consultation screens
  AddConsultancy?: {};
  BookConsultation: {
    consultant: Consultant;
  };
  RescheduleConsultation?: {
    appointment: Appointment;
  };
  PayConsultation: {
    consultant: Consultant;
  };
  MyConsultation: undefined;
  ScheduledConsultation: undefined;
  FavouriteConsultants: undefined;

  // Chat and messaging
  ChatScreen?: {
    user?: User | Consultant;
    appointment?: Appointment;
    conversation?: Conversation;
  };

  // Groups and communities
  CreateGroup?: {
    group?: MiniGroup | Group;
  };
  JoinGroup: {
    group: MiniGroup | Group;
  };
  ViewGroup: {
    group: MiniGroup | Group;
  };

  // Settings and business
  Settings: undefined;
  MyBusiness: undefined;
  Dashboard: undefined;
  AvailabilitySettings: undefined;
  MeetingPreference: undefined;
  Pricing: undefined;
  CalendarView: undefined;
  MyWallet: undefined;
  AccountSettings: undefined;
  PrivacySettings: undefined;
  NotificationSettings: undefined;
  PaymentSettings: undefined;
  GeneralSettings: undefined;
  SecuritySettings: undefined;
  HelpAndSupport: undefined;
};

// Bottom tab navigation - main app tabs
export type BottomTabList = {
  Home: { title: string } | undefined;
  Consultant: { title: string } | undefined;
  Message: { title: string } | undefined;
  Communities: { title: string } | undefined;
  Profile: { title: string } | undefined;
};