
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
}
