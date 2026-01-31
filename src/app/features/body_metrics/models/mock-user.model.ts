export interface User {
  id: string;
  name: string;
  email: string;
  gender?: 'male' | 'female';
}

export const MOCK_USER: User = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Test User',
  email: 'test@fittracker.dev',
  gender: 'female'
};
