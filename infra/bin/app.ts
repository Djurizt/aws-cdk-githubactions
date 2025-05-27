import { App } from "aws-cdk-lib";
import { NetworkStack } from "../lib/network";
import { DatabaseStack } from "../lib/db";
import { ServiceStack } from "../lib/service";

const app = new App();
const stage = app.node.tryGetContext("stage") ?? "dev";

const network = new NetworkStack(app, `Network-${stage}`, { stage });
const db = new DatabaseStack(app, `Database-${stage}`, {
  vpc: network.vpc,
  stage,
});
new ServiceStack(app, `Service-${stage}`, {
  vpc: network.vpc,
  db,
  stage,
});