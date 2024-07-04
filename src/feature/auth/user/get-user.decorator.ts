import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/global/model/db/user';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    },
);