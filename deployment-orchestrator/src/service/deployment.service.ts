import { Guid } from 'guid-typescript';
import { Logger, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientSecretCredential, DefaultAzureCredential } from "@azure/identity";
import * as msRest from "@azure/ms-rest-js";
import {
    Deployment,
    DeploymentOperation,
    ExportTemplateRequest,
    GenericResource,
    ParametersLink,
    ResourceGroup,
    ResourceGroupPatchable,
    ResourceManagementClient,
    ResourcesMoveInfo,
    ScopedDeployment,
    TagsPatchResource,
    TagsResource,
    TemplateLink,
} from "@azure/arm-resources";
import { ManagementGroupsAPI } from "@azure/arm-managementgroups";
import { AzureDeploymentManager, AzureDeploymentManagerModels, AzureDeploymentManagerMappers } from "@azure/arm-deploymentmanager";
import { DeploymentParams, IDeploymentParams, DeploymentParamsPropsArray, propsArray } from 'src/models/deployment-params';
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { stringify } from 'querystring';

export interface IDeploymentResult {
    success: boolean;
    deploymentOperations: Array<DeploymentOperation>;
}

@Injectable()
export class DeploymentService implements OnModuleInit {
    private readonly defaultMainTemplateUri = "https://neudipdevdeployment.blob.core.windows.net/packages/1-7-4/mainTemplate.json?sp=r&st=2022-06-22T22:16:18Z&se=2032-06-23T06:16:18Z&spr=https&sv=2021-06-08&sr=c&sig=KLB%2FQ1OHNX6gMeSq1jPiIWMLDcTiUf5tv2820UONCmU%3D";
    private readonly defaultResourceGroup = "neu-ai-dip-marketplace-test-rg";
    private readonly defaultDeploymentName = "neu-ai-dip-install";
    
    private readonly logger = new Logger(DeploymentService.name);
    private mainTemplateUri: string
    private resourceClient: ResourceManagementClient
    private managementGroupsApi: ManagementGroupsAPI;

    public constructor() {
        const tenantId = process.env.DEPLOYMENT_ORCHESTRATOR_TENANT_ID ?? "";
        const clientId = process.env.DEPLOYMENT_ORCHESTRATOR_CLIENT_ID ?? "";
        const clientSecret = process.env.DEPLOYMENT_ORCHESTRATOR_CLIENT_SECRET ?? "";
        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

        const subscriptionId = process.env.DEPLOYMENT_ORCHESTRATOR_SUBSCRIPTION_ID ?? "";
        this.resourceClient = new ResourceManagementClient(credential, subscriptionId);

        this.mainTemplateUri = process.env.DEPLOYMENT_TEMPLATE_URI ?? this.defaultMainTemplateUri;
    }

    public loadParamsRecords() : Record<string, unknown> {
        let paramsRecord: Record<string, unknown> = {};
        for (let item of propsArray) {
            if (typeof process.env[item] == "string") {
                paramsRecord[item] = {
                    "value": process.env[item]
                };
            }
        }
        return paramsRecord; 
    }

    private loadParams() : DeploymentParams {
        const deploymentParams = new DeploymentParams();
        for (let item of propsArray) {
            if (process.env[item]) {
                deploymentParams[item] = {
                    "value": process.env[item]
                };
            }
        }
        return deploymentParams;
    }

    public async listDeploymentsOperations(resourceGroupName: string, deploymentName: string) {
        const deploymentOperations: Array<DeploymentOperation> = [];
        for await (const item of this.resourceClient.deploymentOperations.list(
            resourceGroupName,
            deploymentName
        )) {
            deploymentOperations.push(item);
        }
        return deploymentOperations;
    }

    public async createOrUpdateDeploymant(
        templateUri: string, 
        parameters: Record<string, unknown>,
        resourceGroupName: string, 
        deploymentName: string) {

        const mode = 'Incremental';
        const templateLink: TemplateLink = {
            uri: templateUri
        }

        const deployment: Deployment = {
            properties: {
                mode: mode,
                templateLink: templateLink,
                parameters: parameters
            }
        }

        const createResult = await this.resourceClient.deployments.beginCreateOrUpdateAndWait(
            resourceGroupName,
            deploymentName,
            deployment
        );

        return createResult
    }

    async onModuleInit() {
        const resourceGroup = process.env.DEPLOYMENT_RESOURCE_GROUP ?? this.defaultResourceGroup;
        const deploymentName = process.env.DEPLOYMENT_NAME ?? this.defaultDeploymentName;

        this.logger.log(`Kicking of deployment.......\n`);
        const paramsRecord = this.loadParamsRecords();

        const deployResult = await this.createOrUpdateDeploymant(
            this.mainTemplateUri,
            paramsRecord, 
            resourceGroup, 
            deploymentName);

        this.logger.log(`deployResult - ${JSON.stringify(deployResult)}`);
    }
}
