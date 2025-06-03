import { Request } from 'express';

type CustomRequest = Request & {
  userID?: string;
  username?: string;
  roles?: string[];
};

export default CustomRequest;
