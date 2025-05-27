import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface DatabaseStackProps extends StackProps {
  vpc: Vpc;
  stage: string;
}

export class DatabaseStack extends Stack {
  public readonly secret: ISecret;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const dbSg = new SecurityGroup(this, 'DbSg', {
      vpc: props.vpc,
      description: 'Allow Postgres from ECS task',
      allowAllOutbound: true,
    });

    dbSg.addIngressRule(Peer.anyIpv4(), Port.tcp(5432), 'Postgres ingress');

    const db = new DatabaseInstance(this, 'Postgres', {
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [dbSg],
      engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.of('15', '3') }),
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      allocatedStorage: 20,
      credentials: Credentials.fromGeneratedSecret('svc_hello'),
      multiAz: false,
      backupRetention: Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
      cloudwatchLogsExports: ['postgresql'],
      autoMinorVersionUpgrade: true,
    });

    this.secret = db.secret!;
  }
}
