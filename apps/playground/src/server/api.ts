import { remultExpress } from 'remult/remult-express';
import { User } from '../shared/User';

export const api = remultExpress({
  entities: [User],
});
