
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Sample video data
const videos = [
  {
    id: "v1",
    title: "City Council Budget Session - January 15, 2025",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=640&h=360&q=80",
    duration: "1:45:22",
    tags: ["budget approval", "public comment", "infrastructure"],
    timestamps: [
      { time: "0:05:30", label: "Budget Introduction" },
      { time: "0:32:15", label: "Public Safety Allocation Discussion" },
      { time: "1:15:40", label: "Community Feedback" }
    ]
  },
  {
    id: "v2",
    title: "Budget Town Hall - December 3, 2024",
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=640&h=360&q=80",
    duration: "1:12:05",
    tags: ["town hall", "public input", "planning"],
    timestamps: [
      { time: "0:03:45", label: "Budget Overview" },
      { time: "0:25:10", label: "Parks & Recreation Plans" },
      { time: "0:48:30", label: "Q&A Session" }
    ]
  }
];

const VideoCard = ({ video }: { video: typeof videos[0] }) => {
  return (
    <Card className="mb-6">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
          {video.duration}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{video.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {video.tags.map((tag, idx) => (
            <Badge key={idx} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <h4 className="text-sm font-medium mb-2">Key Moments:</h4>
        <div className="space-y-2">
          {video.timestamps.map((timestamp, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs py-0 h-7"
              >
                {timestamp.time}
              </Button>
              <span className="text-sm">{timestamp.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const VideoSection = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Related Council Meetings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
