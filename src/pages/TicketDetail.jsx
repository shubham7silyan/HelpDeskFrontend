import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingReply, setSubmittingReply] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  const fetchTicketData = async () => {
    try {
      const [ticketRes, auditRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/audit/tickets/${id}`)
      ]);

      setTicket(ticketRes.data.ticket);
      setAuditLogs(auditRes.data.auditLogs);

      // Fetch agent suggestion if available
      if (ticketRes.data.ticket.agentSuggestionId && user.role !== 'user') {
        try {
          const suggestionRes = await api.get(`/agent/suggestion/${id}`);
          setSuggestion(suggestionRes.data.suggestion);
        } catch (error) {
          console.log('No agent suggestion available');
        }
      }
    } catch (error) {
      toast.error('Failed to load ticket details');
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitReply = async (data) => {
    setSubmittingReply(true);
    try {
      await api.post(`/tickets/${id}/reply`, { content: data.content });
      toast.success('Reply sent successfully!');
      reset();
      fetchTicketData(); // Refresh data
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully!');
      fetchTicketData();
    } catch (error) {
      toast.error('Failed to update status');
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

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="card h-64 mb-6"></div>
        <div className="card h-32"></div>
      </div>
    );
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/tickets')}
          className="mr-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className={getStatusBadge(ticket.status)}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500">
              Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        {/* Status Actions for Agents */}
        {user.role !== 'user' && (
          <div className="flex space-x-2">
            {ticket.status !== 'resolved' && (
              <button
                onClick={() => updateStatus('resolved')}
                className="btn-primary text-sm"
              >
                Mark Resolved
              </button>
            )}
            {ticket.status !== 'closed' && (
              <button
                onClick={() => updateStatus('closed')}
                className="btn-secondary text-sm"
              >
                Close
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Ticket */}
          <div className="card">
            <div className="flex items-start space-x-3">
              <UserIcon className="h-8 w-8 text-gray-400 mt-1" />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{ticket.createdBy.name}</span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                
                {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                    <div className="space-y-1">
                      {ticket.attachmentUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-500 block"
                        >
                          {url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Agent Suggestion (for agents/admins) */}
          {suggestion && user.role !== 'user' && (
            <div className="card border-l-4 border-l-blue-500">
              <div className="flex items-start space-x-3">
                <ComputerDesktopIcon className="h-8 w-8 text-blue-500 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">AI Assistant Suggestion</span>
                    <span className="text-sm text-gray-500">
                      Confidence: {(suggestion.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion.draftReply}</p>
                  </div>
                  {suggestion.citations && suggestion.citations.length > 0 && (
                    <div className="text-xs text-gray-500">
                      <strong>References:</strong> {suggestion.citations.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {ticket.replies && ticket.replies.map((reply, index) => (
            <div key={index} className="card">
              <div className="flex items-start space-x-3">
                {reply.isAgentReply ? (
                  <ComputerDesktopIcon className="h-8 w-8 text-blue-500 mt-1" />
                ) : (
                  <UserIcon className="h-8 w-8 text-gray-400 mt-1" />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {reply.author ? reply.author.name : 'AI Assistant'}
                    </span>
                    {reply.isAgentReply && (
                      <span className="badge bg-blue-100 text-blue-800">Agent</span>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Reply Form */}
          {ticket.status !== 'closed' && (
            <div className="card">
              <form onSubmit={handleSubmit(onSubmitReply)}>
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Add Reply
                  </label>
                  <textarea
                    {...register('content', { 
                      required: 'Reply content is required',
                      minLength: {
                        value: 5,
                        message: 'Reply must be at least 5 characters'
                      }
                    })}
                    rows={4}
                    className="input-field"
                    placeholder="Type your reply here..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReply}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    {submittingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-2 ${getStatusBadge(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 capitalize">{ticket.category}</span>
              </div>
              <div>
                <span className="text-gray-500">Created by:</span>
                <span className="ml-2">{ticket.createdBy.name}</span>
              </div>
              {ticket.assignee && (
                <div>
                  <span className="text-gray-500">Assigned to:</span>
                  <span className="ml-2">{ticket.assignee.name}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2">{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
              {ticket.resolvedAt && (
                <div>
                  <span className="text-gray-500">Resolved:</span>
                  <span className="ml-2">{new Date(ticket.resolvedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
            <div className="space-y-3">
              {auditLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {log.action.replace(/_/g, ' ').toLowerCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      {log.userId && ` by ${log.userId.name}`}
                    </p>
                    {log.meta && Object.keys(log.meta).length > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        {JSON.stringify(log.meta, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
