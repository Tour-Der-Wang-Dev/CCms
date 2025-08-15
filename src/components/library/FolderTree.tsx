import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

const FolderTree = () => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['content-pillars']));

  const folders = [
    {
      id: 'content-pillars',
      name: 'Content Pillars',
      children: [
        { id: 'thought-leadership', name: 'Thought Leadership', count: 23 },
        { id: 'product-education', name: 'Product Education', count: 18 },
        { id: 'industry-insights', name: 'Industry Insights', count: 15 },
        { id: 'community-building', name: 'Community Building', count: 12 },
      ],
    },
    {
      id: 'templates',
      name: 'Templates',
      children: [
        { id: 'blog-templates', name: 'Blog Templates', count: 8 },
        { id: 'social-templates', name: 'Social Templates', count: 12 },
        { id: 'email-templates', name: 'Email Templates', count: 6 },
      ],
    },
    {
      id: 'assets',
      name: 'Visual Assets',
      children: [
        { id: 'images', name: 'Images', count: 45 },
        { id: 'videos', name: 'Videos', count: 12 },
        { id: 'graphics', name: 'Graphics', count: 28 },
      ],
    },
    {
      id: 'research',
      name: 'Research & Data',
      children: [
        { id: 'market-research', name: 'Market Research', count: 7 },
        { id: 'competitor-analysis', name: 'Competitor Analysis', count: 9 },
        { id: 'customer-insights', name: 'Customer Insights', count: 14 },
      ],
    },
  ];

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Library Structure</h2>
      
      <div className="space-y-2">
        {folders.map((folder) => (
          <div key={folder.id}>
            <button
              onClick={() => toggleFolder(folder.id)}
              className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-left"
            >
              {expandedFolders.has(folder.id) ? (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              )}
              {expandedFolders.has(folder.id) ? (
                <FolderOpen className="w-4 h-4 text-sage" />
              ) : (
                <Folder className="w-4 h-4 text-neutral-500" />
              )}
              <span className="font-medium text-neutral-900">{folder.name}</span>
            </button>

            {expandedFolders.has(folder.id) && (
              <div className="ml-6 mt-1 space-y-1">
                {folder.children.map((child) => (
                  <button
                    key={child.id}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-2">
                      <Folder className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-700 group-hover:text-neutral-900">
                        {child.name}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">{child.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderTree;