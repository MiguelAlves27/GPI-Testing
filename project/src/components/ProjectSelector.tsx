import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, Edit3 } from 'lucide-react';
import { useProject, Project } from '../context/ProjectContext';

const ProjectSelector = () => {
  const { 
    currentProject, 
    projects, 
    loading,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject 
  } = useProject();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(projectName, projectDescription);
      setProjectName('');
      setProjectDescription('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      await updateProject(editingProject.id, projectName, projectDescription);
      setProjectName('');
      setProjectDescription('');
      setIsEditModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProject(project.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    setIsEditModalOpen(true);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="font-medium truncate max-w-[200px]">
          {currentProject?.name || 'Select Project'}
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCreateModalOpen(true);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Plus size={16} className="mr-2" />
              Create New Project
            </button>
          </div>
          
          <div className="border-t border-gray-200">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-50"
              >
                <button
                  onClick={() => {
                    setCurrentProject(project);
                    setIsOpen(false);
                  }}
                  className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900"
                >
                  {project.name}
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <form onSubmit={handleCreateProject} className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Project</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <form onSubmit={handleUpdateProject} className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Project</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;