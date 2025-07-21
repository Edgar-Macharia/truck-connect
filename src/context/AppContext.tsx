import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Job, Notification } from '../types';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

interface AppContextType {
  user: User | null;
  jobs: Job[];
  notifications: Notification[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setJobs: (jobs: Job[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  setIsLoading: (loading: boolean) => void;
  addJob: (job: Job) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  toast: ReturnType<typeof useToast>;
  auth: ReturnType<typeof useAuth>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const auth = useAuth();

  // Use auth.user instead of local user state
  const setUser = (user: User | null) => {
    // This is handled by the auth hook
  };

  const addJob = (job: Job) => {
    setJobs(prev => [job, ...prev]);
    toast.showSuccess('Job Created', 'Your booking has been successfully created!');
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
    
    if (updates.status) {
      const statusMessages = {
        'matched': 'Driver Found!',
        'in-progress': 'Job Started',
        'completed': 'Job Completed',
        'cancelled': 'Job Cancelled'
      };
      
      const message = statusMessages[updates.status as keyof typeof statusMessages];
      if (message) {
        toast.showInfo('Status Update', message);
      }
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    toast.showInfo('New Notification', notification.title);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  return (
    <AppContext.Provider value={{
      user: auth.user,
      jobs,
      notifications,
      isLoading: isLoading || auth.loading,
      setUser,
      setJobs,
      setNotifications,
      setIsLoading,
      addJob,
      updateJob,
      addNotification,
      markNotificationAsRead,
      toast,
      auth,
    }}>
      {children}
    </AppContext.Provider>
  );
};