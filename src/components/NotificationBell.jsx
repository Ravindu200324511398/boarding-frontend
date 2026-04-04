import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiX, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  @keyframes bellRing {
    0%,100% { transform: rotate(0deg); }
    15%      { transform: rotate(15deg); }
    30%      { transform: rotate(-12deg); }
    45%      { transform: rotate(10deg); }
    60%      { transform: rotate(-8deg); }
    75%      { transform: rotate(5deg); }
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-10px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes badgePop {
    0%   { transform: scale(0); }
    70%  { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .notif-bell-btn {
    position: relative;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    padding: 0.5rem;
    cursor: pointer;
    color: rgba(220,233,255,0.65);
    display: flex;
    align-items: center;
    transition: all 0.2s;
  }
  .notif-bell-btn:hover {
    background: rgba(255,255,255,0.12);
    color: #dce9ff;
  }
  .notif-bell-btn.has-unread {
    border-color: rgba(0,212,170,0.3);
    animation: bellRing 1.2s ease 0.5s;
  }

  .notif-badge {
    position: absolute;
    top: -6px; right: -6px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff;
    font-size: 0.6rem;
    font-weight: 800;
    min-width: 18px;
    height: 18px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid #060f2a;
    animation: badgePop 0.3s cubic-bezier(.34,1.56,.64,1);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .notif-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 360px;
    background: rgba(6,9,20,0.97);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,170,0.08);
    backdrop-filter: blur(24px);
    z-index: 3000;
    animation: dropIn 0.22s cubic-bezier(.34,1.56,.64,1);
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .notif-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.2rem 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .notif-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 0.9rem 1.2rem;
    cursor: pointer;
    transition: all 0.18s;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    animation: slideIn 0.3s ease both;
    position: relative;
  }
  .notif-item:hover { background: rgba(255,255,255,0.04); }
  .notif-item.unread { background: rgba(0,212,170,0.04); }
  .notif-item.unread:hover { background: rgba(0,212,170,0.07); }

  .notif-icon {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .notif-dot {
    position: absolute;
    top: 50%;
    right: 1.2rem;
    transform: translateY(-50%);
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #00d4aa;
    box-shadow: 0 0 6px #00d4aa;
  }

  .mark-all-btn {
    background: none;
    border: none;
    color: #00d4aa;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: opacity 0.2s;
    padding: 0;
  }
  .mark-all-btn:hover { opacity: 0.75; }

  .notif-empty {
    padding: 3rem 1.5rem;
    text-align: center;
    color: rgba(220,233,255,0.3);
  }

  .notif-footer {
    padding: 0.7rem 1.2rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    text-align: center;
  }
`;

const typeConfig = {
  inquiry_received: { icon: '📬', bg: 'rgba(14,165,233,0.15)', color: '#0ea5e9', route: '/inquiries' },
  inquiry_accepted: { icon: '✅', bg: 'rgba(0,212,170,0.15)', color: '#00d4aa', route: '/my-inquiries' },
  inquiry_declined: { icon: '❌', bg: 'rgba(248,113,113,0.15)', color: '#f87171', route: '/my-inquiries' },
  inquiry_reviewed: { icon: '👁️', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', route: '/my-inquiries' },
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Poll every 30 seconds for new notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleClickNotif = async (notif) => {
    try {
      if (!notif.isRead) {
        await api.patch(`/notifications/${notif._id}/read`);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      const config = typeConfig[notif.type];
      if (config?.route) navigate(config.route);
      setOpen(false);
    } catch {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      const deleted = notifications.find(n => n._id === id);
      if (deleted && !deleted.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ position: 'relative' }} ref={dropRef}>
        <button
          onClick={handleOpen}
          className={`notif-bell-btn${unreadCount > 0 ? ' has-unread' : ''}`}
        >
          <FiBell size={17} />
          {unreadCount > 0 && (
            <span className="notif-badge">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="notif-dropdown">
            {/* Header */}
            <div className="notif-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#dce9ff' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)', fontSize: '0.7rem', fontWeight: 800, padding: '0.1rem 0.55rem', borderRadius: 20 }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button className="mark-all-btn" onClick={handleMarkAllRead}>
                  <FiCheck size={12} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {loading && notifications.length === 0 ? (
                <div className="notif-empty">
                  <div className="spinner-border" style={{ color: '#00d4aa', width: '1.5rem', height: '1.5rem' }} />
                </div>
              ) : notifications.length === 0 ? (
                <div className="notif-empty">
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>🔔</div>
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>No notifications yet</p>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', opacity: 0.6 }}>We'll notify you when something happens</p>
                </div>
              ) : (
                notifications.map((notif, idx) => {
                  const config = typeConfig[notif.type] || typeConfig.inquiry_received;
                  return (
                    <div
                      key={notif._id}
                      className={`notif-item${!notif.isRead ? ' unread' : ''}`}
                      style={{ animationDelay: `${idx * 0.04}s` }}
                      onClick={() => handleClickNotif(notif)}
                    >
                      <div className="notif-icon" style={{ background: config.bg }}>
                        {config.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: notif.isRead ? 'rgba(220,233,255,0.6)' : '#dce9ff', fontWeight: notif.isRead ? 500 : 700, lineHeight: 1.45 }}>
                          {notif.message}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(220,233,255,0.3)', fontWeight: 600 }}>
                            {timeAgo(notif.createdAt)}
                          </span>
                          {notif.boarding?.title && (
                            <>
                              <span style={{ color: 'rgba(220,233,255,0.15)', fontSize: '0.65rem' }}>·</span>
                              <span style={{ fontSize: '0.72rem', color: config.color, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>
                                {notif.boarding.title}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, notif._id)}
                        style={{ background: 'none', border: 'none', color: 'rgba(220,233,255,0.2)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,233,255,0.2)'}
                      >
                        <FiX size={14} />
                      </button>
                      {!notif.isRead && <div className="notif-dot" />}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="notif-footer">
                <button
                  onClick={() => { navigate('/my-inquiries'); setOpen(false); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(220,233,255,0.4)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#00d4aa'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,233,255,0.4)'}
                >
                  View all activity →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;