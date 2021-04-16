import * as jwt from "jsonwebtoken";
import { Handler } from "aws-lambda";

type policyFunction = (a: any, b: any) => object;

// By default, API Gateway authorizations are cached (TTL) for 300 seconds.
// This policy will authorize all requests to the same API Gateway instance where the
// request is coming from, thus being efficient and optimizing costs.
const generatePolicy: policyFunction = (principalId, methodArn) => {
  const apiGatewayWildcard: string = methodArn.split("/", 2).join("/") + "/*";

  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};

export const handler: Handler<any, any> = async (event, context) => {
  if (!event.authorizationToken) {
    throw "Unauthorized";
  }

  const token: string = event.authorizationToken.replace("Bearer ", "");

  try {
    const claims: any = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
    const policy: object = generatePolicy(claims.sub, event.methodArn);

    return {
      ...policy,
      context: claims,
    };
  } catch (error) {
    console.log(error);
    throw "Unauthorized";
  }
};
