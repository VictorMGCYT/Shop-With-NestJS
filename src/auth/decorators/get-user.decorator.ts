import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const GetUser = createParamDecorator(
    ( data, context: ExecutionContext) => {

        // Extraer la Request 
        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if( !user ){
            throw new InternalServerErrorException('User not found in request')
        }

        return user;
    }
);