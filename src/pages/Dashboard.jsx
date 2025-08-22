import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TicketIcon, 
  PlusIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ChartBarIcon,
  BookOpenIcon,
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CpuChipIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ticketsRes] = await Promise.all([
        user.role !== 'user' ? api.get('/tickets/meta/stats') : Promise.resolve({ data: null }),
        api.get('/tickets?limit=5')
      ]);

      if (statsRes.data) {
        setStats(statsRes.data.statusCounts);
      }
      setRecentTickets(ticketsRes.data.tickets);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">Wexa AI Intelligence</h1>
            <p className="dashboard-subtitle">Advanced Business Intelligence & Analytics Platform</p>
            <div className="header-meta">
              <span className="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span className="status-indicator">
                <div className="status-dot"></div>
                Real-time Data
              </span>
            </div>
          </div>
          <div className="header-actions">
            <div className="ai-insight-card">
              <SparklesIcon className="ai-icon" />
              <div className="ai-text">
                <span className="ai-label">AI Engine</span>
                <span className="ai-value">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-primary">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper kpi-icon-primary">
              <TicketIcon className="kpi-icon" />
            </div>
            <div className="kpi-trend kpi-trend-up">
              <ArrowUpIcon className="trend-icon" />
              <span>+12%</span>
            </div>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-title">Total Requests</h3>
            <div className="kpi-value">{stats ? (stats.open + stats.triaged + stats.waiting_human + stats.resolved + stats.closed) : '2,847'}</div>
            <p className="kpi-subtitle">This month</p>
          </div>
        </div>

        <div className="kpi-card kpi-warning">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper kpi-icon-warning">
              <ClockIcon className="kpi-icon" />
            </div>
            <div className="kpi-trend kpi-trend-down">
              <ArrowDownIcon className="trend-icon" />
              <span>-18%</span>
            </div>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-title">Response Time</h3>
            <div className="kpi-value">1.2h</div>
            <p className="kpi-subtitle">Average</p>
          </div>
        </div>

        <div className="kpi-card kpi-success">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper kpi-icon-success">
              <CheckCircleIcon className="kpi-icon" />
            </div>
            <div className="kpi-trend kpi-trend-up">
              <ArrowUpIcon className="trend-icon" />
              <span>+7%</span>
            </div>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-title">Success Rate</h3>
            <div className="kpi-value">97.8%</div>
            <p className="kpi-subtitle">Resolution</p>
          </div>
        </div>

        <div className="kpi-card kpi-info">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper kpi-icon-info">
              <CpuChipIcon className="kpi-icon" />
            </div>
            <div className="kpi-trend kpi-trend-up">
              <ArrowUpIcon className="trend-icon" />
              <span>+31%</span>
            </div>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-title">AI Automation</h3>
            <div className="kpi-value">84%</div>
            <p className="kpi-subtitle">Auto-resolved</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Chart Section */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Performance Analytics</h3>
            <div className="chart-controls">
              <button className="chart-control active">7D</button>
              <button className="chart-control">30D</button>
              <button className="chart-control">90D</button>
            </div>
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="chart-bar" style={{height: '65%'}}></div>
                <div className="chart-bar" style={{height: '78%'}}></div>
                <div className="chart-bar" style={{height: '52%'}}></div>
                <div className="chart-bar" style={{height: '89%'}}></div>
                <div className="chart-bar" style={{height: '73%'}}></div>
                <div className="chart-bar" style={{height: '91%'}}></div>
                <div className="chart-bar" style={{height: '96%'}}></div>
                <div className="chart-bar" style={{height: '84%'}}></div>
                <div className="chart-bar" style={{height: '67%'}}></div>
                <div className="chart-bar" style={{height: '92%'}}></div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color legend-primary"></div>
                  <span>Requests</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-success"></div>
                  <span>Resolved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-card">
          <div className="actions-header">
            <h3 className="actions-title">Quick Actions</h3>
          </div>
          <div className="actions-grid">
            <Link to="/tickets/new" className="action-item action-primary">
              <PlusIcon className="action-icon" />
              <span>New Request</span>
            </Link>
            <Link to="/tickets" className="action-item action-secondary">
              <ChartBarIcon className="action-icon" />
              <span>Analytics</span>
            </Link>
            {user.role !== 'user' && (
              <>
                <Link to="/kb" className="action-item action-info">
                  <BookOpenIcon className="action-icon" />
                  <span>Knowledge Hub</span>
                </Link>
                <Link to="/settings" className="action-item action-warning">
                  <CogIcon className="action-icon" />
                  <span>Configure</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-card">
          <div className="activity-header">
            <h3 className="activity-title">Live Activity</h3>
            <Link to="/tickets" className="view-all-link">View All</Link>
          </div>
          <div className="activity-list">
            {recentTickets.length > 0 ? (
              recentTickets.slice(0, 5).map((ticket, index) => (
                <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="activity-item">
                  <div className="activity-indicator"></div>
                  <div className="activity-content">
                    <p className="activity-title-text">{ticket.title}</p>
                    <p className="activity-meta">
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <span className={`activity-status status-${ticket.status}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <SparklesIcon className="empty-icon" />
                <p className="empty-text">No recent activity</p>
                <Link to="/tickets/new" className="empty-action">Start Analysis</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
