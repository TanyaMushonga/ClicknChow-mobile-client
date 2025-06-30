export interface Review {
  id: string;
  userId: string;
  lastName: string;
  firstName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount?: number;
  isHelpful?: boolean;
}
