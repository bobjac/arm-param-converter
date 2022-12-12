import { Guid } from 'guid-typescript';
import { Logger, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientSecretCredential, DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

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
import { arrayBuffer } from 'stream/consumers';

export interface IDeploymentResult {
    success: boolean;
    deploymentOperations: Array<DeploymentOperation>;
}

@Injectable()
export class DeploymentService implements OnModuleInit {
    private readonly defaultMainTemplateUri = "https://neudipdevdeployment.blob.core.windows.net/packages/1-7-4/mainTemplate.json?sp=r&st=2022-06-22T22:16:18Z&se=2032-06-23T06:16:18Z&spr=https&sv=2021-06-08&sr=c&sig=KLB%2FQ1OHNX6gMeSq1jPiIWMLDcTiUf5tv2820UONCmU%3D";
    private readonly blobAccountName = "bobjacdip";
    private readonly defaultResourceGroup = "neu-ai-dip-marketplace-test-rg";
    private readonly defaultDeploymentName = "neu-ai-dip-install";
    private readonly defaultDeploymentContainer = "dipdeployments";
    
    private readonly logger = new Logger(DeploymentService.name);
    private mainTemplateUri: string
    private resourceClient: ResourceManagementClient
    private managementGroupsApi: ManagementGroupsAPI;
    private blobServiceClient: BlobServiceClient;
    private blobSasToken: string;

    public constructor() {
        const tenantId = process.env.DEPLOYMENT_ORCHESTRATOR_TENANT_ID ?? "";
        const clientId = process.env.DEPLOYMENT_ORCHESTRATOR_CLIENT_ID ?? "";
        const clientSecret = process.env.DEPLOYMENT_ORCHESTRATOR_CLIENT_SECRET ?? "";
        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

        const subscriptionId = process.env.DEPLOYMENT_ORCHESTRATOR_SUBSCRIPTION_ID ?? "";
        this.resourceClient = new ResourceManagementClient(credential, subscriptionId);
        
        this.blobServiceClient = BlobServiceClient.fromConnectionString('DefaultEndpointsProtocol=https;AccountName=bobjacdip;AccountKey=kzeiLIljR+b6Ho1/A65F0Wsq3Xw/v69S5yOen9fFwN4IL8MM2oaGbH3jqZP56KSRPbCUjA84lQhu+AStslKrZg==;EndpointSuffix=core.windows.net');
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

    public mapParamsToRecords(deploymentParams: DeploymentParams): Record<string, unknown> {
        let paramsRecord: Record<string, unknown> = {};
        for (let item of propsArray) {
            if (deploymentParams[item] && typeof deploymentParams[item] == "string") {
                paramsRecord[item] = {
                    "value": deploymentParams[item]
                };
            }
        }
        return paramsRecord;
    }

    public loadParams() : DeploymentParams {
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

    public async listContainers(): Promise<string[]> {
        const containers: string[] = [];
        let i = 1;
        let containersResult = this.blobServiceClient.listContainers();
        for await (const container of containersResult) {
            containers.push(container.name);
        }
        return containers;
    }

    public async listBlobsInContainer(containerName: string): Promise<string[]> {
        const blobNames: string[] = [];
        this.logger.log(`Inside listBlobsInContainer with a containerName of ${containerName}`);
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        let i = 1;
        let blobs = containerClient.listBlobsFlat();
        for await (const blob of blobs) {
            this.logger.log(`${blob.name}`);
            blobNames.push(blob.name);
        }
        return blobNames;
    }

    public async getLatestDeploymentParamValues(): Promise<string> {
        const blobNames = await this.listBlobsInContainer(this.defaultDeploymentContainer);
        const sortedNames = blobNames.sort();
        this.logger.log(`Sorted blob names- ${sortedNames}`);
        const lastName = sortedNames.pop();
        return this.getBlobAsString(this.defaultDeploymentContainer, lastName);
    }

    public async getBlobAsString(containerName: string, blobName: string): Promise<string> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);
        const downloadBlockBlobResponse = await blobClient.download();
        const downloaded = (
            await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
        ).toString();
        this.logger.log("Downloaded blob content:", downloaded);
        return downloaded;
    }

    private async streamToBuffer(readableStream) {
        return new Promise((resolve, reject) => {
          const chunks = [];
          readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
          });
          readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
          });
          readableStream.on("error", reject);
        });
      }

    public async deployFromStoredParams(resourceGroup: string, deploymentName: string) {
        this.logger.log(`Kicking of deployment.......\n`);
        const paramsRecord = this.loadParamsRecords();

        const deployResult = this.createOrUpdateDeploymant(
            this.mainTemplateUri,
            paramsRecord, 
            resourceGroup, 
            deploymentName);
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

    public getDefaultUri(): string {
        return this.defaultMainTemplateUri;
    }

    private getResourceGroup(): string {
        return process.env.DEPLOYMENT_RESOURCE_GROUP ?? this.defaultResourceGroup;
    }

    private getDeploymentName(): string {
        return process.env.DEPLOYMENT_NAME ?? this.defaultDeploymentName;
    }

    public async saveDeploymentParams(deploymentRecords: Record<string, unknown>) {
        const containerClient = this.blobServiceClient.getContainerClient(this.defaultDeploymentContainer);
        const content = JSON.stringify(deploymentRecords);
        const blobName = `${this.getResourceGroup()}/${this.getDeploymentName()}/${new Date().getTime()}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
        this.logger.log(`Upload block blob ${blobName} successfully with a requestId of ${uploadBlobResponse.requestId}`);
    }

    async onModuleInit() {
        const resourceGroup = this.getResourceGroup();
        const deploymentName = this.getDeploymentName();

        this.logger.log(`Kicking of deployment.......\n`);
        const paramRecords = this.loadParamsRecords();
        await this.saveDeploymentParams(paramRecords);

        this.listContainers();
        this.listBlobsInContainer(this.defaultDeploymentContainer);

        const lastName = await this.getLatestDeploymentParamValues();
        this.logger.log(`'Returned last name - ${lastName}`);

        const deployResult = this.createOrUpdateDeploymant(
            this.mainTemplateUri,
            paramRecords, 
            resourceGroup, 
            deploymentName);

        this.logger.log(`The Document Intelligence Deployment has been kicked off`);
    }
}
