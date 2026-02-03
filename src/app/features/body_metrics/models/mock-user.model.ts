export interface User {
  id: number;
  name: string;
  email: string;
  gender?: 'male' | 'female';
}

export const MOCK_USER: User = {
  id: 11111111,
  name: 'Test User',
  email: 'test@fittracker.dev',
  gender: 'female'
};
