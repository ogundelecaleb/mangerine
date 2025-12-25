import { NavigatorScreenParams } from '@react-navigation/native';

// Types for different entities in the app
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  // Add more user properties as needed
}

export interface Consultant extends User {
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
  // Add more appointment properties
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