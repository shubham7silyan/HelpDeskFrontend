import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import toast from 'react-hot-toast';

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchArticles();
  }, [searchQuery]);

  const fetchArticles = async () => {
    try {
      const params = searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : '';
      const response = await api.get(`/kb${params}`);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const articleData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      if (editingArticle) {
        await api.put(`/kb/${editingArticle._id}`, articleData);
        toast.success('Article updated successfully!');
      } else {
        await api.post('/kb', articleData);
        toast.success('Article created successfully!');
      }

      setShowModal(false);
      setEditingArticle(null);
      reset();
      fetchArticles();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save article');
    }
  };

  const deleteArticle = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await api.delete(`/kb/${id}`);
      toast.success('Article deleted successfully!');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const openEditModal = (article) => {
    setEditingArticle(article);
    reset({
      title: article.title,
      body: article.body,
      tags: article.tags.join(', '),
      status: article.status
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    reset();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <button onClick={openCreateModal} className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Article
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="input-field flex-1"
          />
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                    <span className={`badge ${article.status === 'published' ? 'badge-resolved' : 'badge-waiting'}`}>
                      {article.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {article.body.substring(0, 200)}...
                  </p>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="badge bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Updated {new Date(article.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(article)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteArticle(article._id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first knowledge base article.
            </p>
            <div className="mt-6">
              <button onClick={openCreateModal} className="btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                New Article
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="input-field mt-1"
                    placeholder="Article title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content *</label>
                  <textarea
                    {...register('body', { required: 'Content is required' })}
                    rows={8}
                    className="input-field mt-1"
                    placeholder="Article content..."
                  />
                  {errors.body && (
                    <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <input
                    {...register('tags')}
                    type="text"
                    className="input-field mt-1"
                    placeholder="billing, technical, shipping (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select {...register('status')} className="input-field mt-1">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingArticle(null);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingArticle ? 'Update' : 'Create'} Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
