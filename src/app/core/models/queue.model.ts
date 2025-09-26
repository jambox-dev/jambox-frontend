import { Song } from './song.model';

export interface QueueAddRequest {
  song_url: string;
}

export interface ApprovalQueue extends Song {
  id: string;
}

export interface ApproveRequest {
  queue_id: string;
  approved: boolean;
}