#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsDynamoMicroserviceStack } from '../lib/aws-dynamo-microservice-stack';

const app = new cdk.App();
new AwsDynamoMicroserviceStack(app, 'AwsDynamoMicroserviceStack');
