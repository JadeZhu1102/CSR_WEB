
export interface IActivity {
  id: number;
  name: string;
  eventId: number;
  templateId: number;
  duration: number;
  icon: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  visibleLocations: string[];
  visibleRoles: string[];
  createdAt: string | null;
  totalParticipants: number | null;
  totalTime: number | null;
  details?: {
    comment: string
    amount: number
  }

  // 以下为虚假的，原UI设计需要的字段
  completed?: boolean;
  isUserAdded?: boolean;
  thumbs?: string[];
}
