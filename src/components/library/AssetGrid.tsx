import React from 'react';
import { FileText, Image, Video, File, MoreHorizontal, Download, Star } from 'lucide-react';

const AssetGrid = () => {
  const assets = [
    {
      id: 1,
      name: 'Product Launch Blog Post.docx',
      type: 'document',
      size: '2.4 MB',
      modified: '2 days ago',
      pillar: 'Product Education',
      thumbnail: null,
      starred: false,
    },
    {
      id: 2,
      name: 'Brand Guidelines Template.pdf',
      type: 'document',
      size: '1.8 MB',
      modified: '1 week ago',
      pillar: 'Brand',
      thumbnail: null,
      starred: true,
    },
    {
      id: 3,
      name: 'Hero Image - Homepage.jpg',
      type: 'image',
      size: '4.2 MB',
      modified: '3 days ago',
      pillar: 'Visual Assets',
      thumbnail: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
      starred: false,
    },
    {
      id: 4,
      name: 'Product Demo Video.mp4',
      type: 'video',
      size: '45.6 MB',
      modified: '5 days ago',
      pillar: 'Product Education',
      thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      starred: true,
    },
    {
      id: 5,
      name: 'Social Media Templates.sketch',
      type: 'design',
      size: '12.3 MB',
      modified: '1 week ago',
      pillar: 'Visual Assets',
      thumbnail: null,
      starred: false,
    },
    {
      id: 6,
      name: 'Customer Interview Notes.txt',
      type: 'document',
      size: '0.8 MB',
      modified: '4 days ago',
      pillar: 'Research',
      thumbnail: null,
      starred: false,
    },
  ];

  const handleDownload = (asset: any) => {
    console.log('Downloading asset:', asset.name);
    // Implement download logic
  };

  const handleStar = (assetId: number) => {
    console.log('Toggling star for asset:', assetId);
    // Implement star toggle logic
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-8 h-8 text-warm-blue" />;
      case 'image':
        return <Image className="w-8 h-8 text-soft-emerald" />;
      case 'video':
        return <Video className="w-8 h-8 text-dusty-purple" />;
      case 'design':
        return <File className="w-8 h-8 text-warm-amber" />;
      default:
        return <File className="w-8 h-8 text-neutral-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all duration-200 hover:shadow-soft group overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="aspect-video bg-neutral-50 flex items-center justify-center relative overflow-hidden">
            {asset.thumbnail ? (
              <img
                src={asset.thumbnail}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center">
                {getTypeIcon(asset.type)}
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleDownload(asset)}
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors duration-200"
                >
                  <Download className="w-4 h-4 text-neutral-700" />
                </button>
                <button 
                  onClick={() => handleStar(asset.id)}
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors duration-200"
                >
                  <Star className={`w-4 h-4 ${asset.starred ? 'text-amber-500 fill-amber-500' : 'text-neutral-700'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-neutral-900 text-sm line-clamp-2 flex-1">
                {asset.name}
              </h3>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-neutral-100 rounded-lg ml-2">
                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>{asset.size}</span>
              <span>{asset.modified}</span>
            </div>

            <div className="inline-block px-2 py-1 bg-sage/10 text-sage rounded-lg text-xs font-medium">
              {asset.pillar}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetGrid;