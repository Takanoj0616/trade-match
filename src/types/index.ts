export type Message = {
  id: string;
  text: string;
  senderId: string;
  chatMembers: string[];
  timestamp: Date;
  isSent: boolean;
}; 

