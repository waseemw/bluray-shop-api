import {createParamDecorator} from "@nestjs/common";
import {ExecutionContextHost} from "@nestjs/core/helpers/execution-context-host";

export const User = createParamDecorator((data: null, ctx: ExecutionContextHost) => {
    return ctx.switchToHttp().getRequest().user;
});