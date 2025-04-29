import { ZodError, ZodSchema } from "zod"
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";

type ActionOptions<T> = {
    params: T,
    schema?: ZodSchema<T>,
    authorize?: boolean
}

async function action<T> ({
    params,
    schema,
    authorize
}: ActionOptions<T>) {
    if(params && schema) {
        try {
            schema.parse(params);
        } catch (error) {
            if(error instanceof ZodError) {
                return new ValidationError(error.flatten().fieldErrors as Record<string, string[]>); 
            } else {
                return new Error("Schema validation failed!");
            }
        }
    }

    let session: Session | null = null;

    if(authorize) {
        session = await auth();

        if(!session) {
            return new UnauthorizedError();
        }
    };

    return { params, session };
}

export default action;