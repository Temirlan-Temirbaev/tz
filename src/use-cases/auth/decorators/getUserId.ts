import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getUserId = createParamDecorator(
  (data: string, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.user["sub"];
  },
);
