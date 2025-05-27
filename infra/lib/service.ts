import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ContainerImage, LogDriver, Secret as EcsSecret } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { DatabaseStack } from './db';

interface ServiceStackProps extends StackProps {
  vpc: Vpc;
  db: DatabaseStack;
  stage: string;
}

export class ServiceStack extends Stack {
  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'ApiLogs', {
      retention: RetentionDays.ONE_WEEK,
    });

    const fargate = new ApplicationLoadBalancedFargateService(this, 'Api', {
      vpc: props.vpc,
      taskImageOptions: {
        image: ContainerImage.fromEcrRepository(
          Repository.fromRepositoryName(this, 'repo', `hello-world-${props.stage}`),
          'latest',
        ),
        environment: { NODE_ENV: 'production' },
        secrets: {
          DATABASE_URL: EcsSecret.fromSecretsManager(props.db.secret, 'url'),
        },
        logDriver: LogDriver.awsLogs({ logGroup, streamPrefix: 'api' }),
      },
      publicLoadBalancer: true,
    });

    fargate.taskDefinition.addToTaskRolePolicy(
      new PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: [props.db.secret.secretArn],
      }),
    );
  }
}
