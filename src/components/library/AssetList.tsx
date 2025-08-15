import React from 'react';
import { FileText, Image, Video, File, MoreHorizontal, Download, Star, Calendar } from 'lucide-react';

const AssetList = () => {
  const assets = [
    {
      id: 1,
      name: 'Product Launch Blog Post.docx',
      type: 'document',
      size: '2.4 MB',
      modified: '2024-01-15',
      pillar: 'Product Education',
      author: 'Sarah Chen',
    },
    {
      id: 2,
      name: 'Brand Guidelines Template.pdf',
      type: 'document',
      size: '1.8 MB',
      modified: '2024-01-10',
      pillar: 'Brand',
      author: 'Mike Johnson',
    },
    {
      id: 3,
      name: 'Hero Image - Homepage.jpg',
      type: 'image',
      size: '4.2 MB',
      modified: '2024-01-12',
      pillar: 'Visual Assets',
      author: 'Emma Davis',
    },
    {
      id: 4,
      name: 'Product Demo Video.mp4',
      type: 'video',
      size: '45.6 MB',
      modified: '2024-01-08',
      pillar: 'Product Education',
      author: 'John Wilson',
    },
    {
      id: 5,
      name: 'Social Media Templates.sketch',
      type: 'design',
      size: '12.3 MB',
      modified: '2024-01-05',
      pillar: 'Visual Assets',
      author: 'Emma Davis',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-warm-blue" />;
      case 'image':
        return <Image className="w-5 h-5 text-soft-emerald" />;
      case 'video':
        return <Video className="w-5 h-5 text-dusty-purple" />;
      case 'design':
        return <File className="w-5 h-5 text-warm-amber" />;
      default:
        return <File className="w-5 h-5 text-neutral-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-neutral-600">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Modified</div>
          <div className="col-span-2">Author</div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Assets */}
      <div className="divide-y divide-neutral-100">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="px-6 py-4 hover:bg-neutral-50 transition-colors duration-200 group"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5 flex items-center space-x-3">
                {getTypeIcon(asset.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-900 truncate">{asset.name}</div>
                  <div className="inline-block px-2 py-1 bg-sage/10 text-sage rounded-lg text-xs font-medium mt-1">
                    {asset.pillar}
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 text-sm text-neutral-600">{asset.size}</div>
              
              <div className="col-span-2 text-sm text-neutral-600 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{asset.modified}</span>
              </div>
              
              <div className="col-span-2 text-sm text-neutral-600">{asset.author}</div>
              
              <div className="col-span-1 flex items-center justify-end space-x-1">
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-neutral-200 rounded-lg">
                  <Download className="w-4 h-4 text-neutral-500" />
                </button>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-neutral-200 rounded-lg">
                  <Star className="w-4 h-4 text-neutral-500" />
                </button>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-neutral-200 rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetList;