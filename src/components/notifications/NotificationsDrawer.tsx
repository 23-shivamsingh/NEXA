import React from 'react';
import { useNexaStore } from '../../store/useNexaStore';
import {
  X,
  Bell,
  CheckCheck,
  ArrowRight,
} from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    toggleNotifications,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openSpace,
    inspectMoment,
  } = useNexaStore();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationRead(notif.id);
    if (notif.targetSpaceId) {
      openSpace(notif.targetSpaceId);
      toggleNotifications(false);
    } else if (notif.targetMomentId) {
      inspectMoment(notif.targetMomentId);
      toggleNotifications(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div
        className="relative flex h-full w-full max-w-md flex-col border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0f22] text-slate-900 dark:text-slate-100 shadow-2xl transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Activity</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Echoes and space updates</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 p-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark read</span>
            </button>

            <button
              onClick={() => toggleNotifications(false)}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`cursor-pointer rounded-2xl border p-3 text-xs transition-colors flex items-start justify-between gap-3 ${
                notif.read
                  ? 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] text-slate-500 dark:text-slate-400'
                  : 'border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-500/[0.05] text-slate-900 dark:text-white font-medium'
              }`}
            >
              <div className="space-y-1">
                <p className="leading-snug">{notif.text}</p>
                <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
