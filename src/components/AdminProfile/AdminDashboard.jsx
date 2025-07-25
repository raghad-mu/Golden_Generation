import { FaUser, FaBriefcase, FaChartBar, FaClock, FaTags, FaChartLine } from "react-icons/fa";
import Dashboard from '../SharedDashboard/SharedDashboard';
import { useTranslation } from 'react-i18next';

import AdminHomepage from "../SharedDashboard/MainPage";
import Cards from "../SharedDashboard/Cards";
import AddEvent from "../SharedDashboard/AddEvents";
import Settings from "../SharedDashboard/SettingsCards";
import AdminCalendar from "../Calendar/AdminCalendar";
import Messages from "../SharedDashboard/Messages";
import Notifications from "../SharedDashboard/Notifications";
import Pending from "./PendingEvents";
import Retirees from "./Retirees";
import Jobs from "./Jobs";
import Analysis from "./Analytics/Analysis";
import ComprehensiveAnalytics from "./Analytics/ComprehensiveAnalytics";
import CategoryManagement from "./CategoryManagement";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const customIcons = [
    { id: "categoryManagement", label: t('dashboard.categoryManagement'), icon: <FaTags /> },
    { id: "retirees", label: t('dashboard.retirees'), icon: <FaUser /> },
    { id: "jobs", label: t('dashboard.volunteerRequests'), icon: <FaBriefcase /> },
    { id: "analysis", label: t('dashboard.analytics'), icon: <FaChartBar /> },
    { id: "comprehensiveAnalytics", label: "Advanced Analytics", icon: <FaChartLine /> },
    { id: "pending", label: t('dashboard.pendingEvents'), icon: <FaClock /> }
  ];

  const customButtons = [];

  const componentsById = {
    upcoming: <Cards />,
    main: <AdminHomepage />,
    settings: <Settings />,
    calendar: <AdminCalendar />,
    messages: <Messages />,
    add: <AddEvent />,
    notifications: <Notifications />,
    retirees: <Retirees />,
    jobs: <Jobs />,
    analysis: <Analysis />,
    comprehensiveAnalytics: <ComprehensiveAnalytics />,
    pending: <Pending />,
    categoryManagement: <CategoryManagement />
  };

  return (
    <Dashboard customIcons={customIcons} customButtons={customButtons} componentsById={componentsById} />
  );
};

export default AdminDashboard;
