export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  thumbnailUrl?: string;
  durationSec?: number;
  duration?: string;
  approved?: boolean;
}