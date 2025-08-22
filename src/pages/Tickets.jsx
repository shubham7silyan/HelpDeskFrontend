import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';

const Tickets = () => {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    my: false
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.my) params.append('my', 'true');
      
      const response = await api.get(`/tickets?${params.toString()}`);
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge badge-open',
      triaged: 'badge badge-triaged',
      waiting_human: 'badge badge-waiting',
      resolved: 'badge badge-resolved',
      closed: 'badge badge-closed'
    };
    return badges[status] || 'badge';
  };

  const getCategoryBadge = (category) => {
    const colors = {
      billing: 'bg-blue-100 text-blue-800',
      tech: 'bg-red-100 text-red-800',
      shipping: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return `badge ${colors[category] || colors.other}`;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <Link to="/tickets/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field w-auto"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="triaged">Triaged</option>
            <option value="waiting_human">Waiting for Human</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="input-field w-auto"
          >
            <option value="">All Categories</option>
            <option value="billing">Billing</option>
            <option value="tech">Technical</option>
            <option value="shipping">Shipping</option>
            <option value="other">Other</option>
          </select>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.my}
              onChange={(e) => setFilters({ ...filters, my: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {user.role === 'user' ? 'My tickets only' : 'Assigned to me'}
            </span>
          </label>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {ticket.title}
                    </h3>
                    <span className={getCategoryBadge(ticket.category)}>
                      {ticket.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created by {ticket.createdBy?.name}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                    {ticket.assignee && (
                      <>
                        <span>•</span>
                        <span>Assigned to {ticket.assignee.name}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={getStatusBadge(ticket.status)}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  {ticket.replies && ticket.replies.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {ticket.replies.length} replies
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new support ticket.
            </p>
            <div className="mt-6">
              <Link to="/tickets/new" className="btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                New Ticket
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
