import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    ( data, context: ExecutionContext) => {

        
        // Extraer la Request 
        const req = context.switchToHttp().getRequest();
        

        return req.rawHeaders

        
    }
);