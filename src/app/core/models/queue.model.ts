import { Song } from './song.model';

export interface QueueAddRequest {
  song_url: string;
}

export interface ApprovalQueue {
  id: string;
  song: {
    songUrl: string;
    songName: string;
    author: string;
    songCover: string;
  }
}

export interface ApproveRequest {
  queue_id: string;
  approved: boolean;
}
export interface QueueSettings {
  id: 'SINGLETON';
  needsApproval: boolean;
  blacklistEnabled: boolean;
}