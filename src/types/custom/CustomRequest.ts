import { AppAbility } from '@/common/config/casl.module';
import { Request } from 'express';
import { ERole } from '../interface/User.type';

type CustomRequest = Request & {
  userID?: string;
  username?: string;
  roles?: ERole[];
  ability?: AppAbility;
};

export default CustomRequest;
