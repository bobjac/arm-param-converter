import { AxiosRequestConfig } from "axios";
import { createSolutionBuilderWithWatch } from "typescript";
import { DeploymentConstants, ProvisionState, ResourceType } from "../constants/deployment.constants";
import { ServiceHelper } from "../lib/serviceHelper";
import { Deployment, DeploymentOperation, DeploymentParams, propsArray } from "../models/deployment-models";

export const getDeploymentOperations = async (resourceGroup: string, deploymentName: string): Promise<Deployment | null> => {
    const uri: string = `http://localhost:3000/api/deployments/${resourceGroup}/${deploymentName}`;
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: uri,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const result = await ServiceHelper.getWithAutoRetry(uri, config);
    //console.log(`getDeploymentOperations:result - ${JSON.stringify(result)}`)
    return mapDeploymentData(result.data);
}

export const postDeployment = async (resourceGroup: string, deploymentName: string): Promise<Deployment | null> => {
    const uri: string = `http://localhost:3000/api/deployments/${resourceGroup}/${deploymentName}`;
    const config: AxiosRequestConfig = {
        method: 'POST',
        url: uri,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const result = await ServiceHelper.postWithAutoRetry(uri, config);
    return mapDeploymentData(result.data);
}

export const getMarketplaceSettings = async () => {
    const uri: string = `http://localhost:3000/api/marketplacesettings`;
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: uri,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const result = await ServiceHelper.getWithAutoRetry<DeploymentParams>(uri, config);
    return mapDeploymentParams(result);
};

export const getDeploymentParamValues = async (resourceGroup: string, deploymentName: string) => {
    const uri: string = `http://localhost:3000/api/marketplacesettings/${resourceGroup}/${deploymentName}`;
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: uri,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const result = await ServiceHelper.getWithAutoRetry<DeploymentParams>(uri, config);
    return mapDeploymentParams(result);
}

export const isSuccessfulDeploymentType = (deploymentOperation: DeploymentOperation): boolean => {
    return (deploymentOperation.resourceType == ResourceType.DEPLOYMENT && 
        deploymentOperation.provisioningState == ProvisionState.SUCCEEDED);
}

export const getResourceGroup = (deploymentOperation: DeploymentOperation): string => {
    //todo: get the correct resource grop from the DeploymentOperation object
    return DeploymentConstants.defaultResourceGroup;
}

export const isSuccess = (deploymentOperation: DeploymentOperation): boolean => {
    return (deploymentOperation.provisioningState == ProvisionState.SUCCEEDED);
}

export const isFailure = (deploymentOperation: DeploymentOperation): boolean => {
    return (deploymentOperation.provisioningState == ProvisionState.FAILED);
}

export const isRunning = (deploymentOperation: DeploymentOperation): boolean => {
    return (deploymentOperation.provisioningState == ProvisionState.RUNNING);
};

const mapDeploymentParams = (inputParams: any): DeploymentParams => {
    //console.log(`Inside mapDeploymentParams with a value of ${JSON.stringify(inputParams)}`);
    let deploymentParams: DeploymentParams = new DeploymentParams();
    for (let item of propsArray) {
        if (inputParams.data[item.toString()]) {
            deploymentParams[item] = inputParams.data[item.toString()].value;
        }
    }
    
    //console.log(`Inside mapDeploymentParams with deploymentParams.deploymentTemplatePath - ${deploymentParams.deploymentTemplatePath.toString()}`);
    return deploymentParams;
}

const mapOperationData = (inputOperation: any): DeploymentOperation => {
    console.log(`inputOperation - ${JSON.stringify(inputOperation)}`)
    const operationProperties = inputOperation.properties;
    const provisioningStatusCode = operationProperties.statusCode;
    
    const targetResource = operationProperties.targetResource;
    const targetResourceName = targetResource ? targetResource.resourceName : "";
    const targetResourceType = targetResource ? targetResource.resourceType : "";

    const statusMessage = operationProperties.statusMessage;

    const errors: string[] = [];
    if (operationProperties.statusMessage 
        && operationProperties?.statusMessage?.status == ProvisionState.FAILED) {
        const errorMessage = operationProperties?.statusMessage?.error?.message;
        errors.push(errorMessage);
    }

    const deploymentOperation: DeploymentOperation = {
        operationId: inputOperation.id,
        provisioningOperation: operationProperties.provisioningOperation,
        provisioningState: operationProperties.provisioningState,
        targetResource: targetResourceName,
        resourceType: targetResourceType,
        errors: [...errors],
    };

    return deploymentOperation
}

const mapDeploymentData = (inputData: any): Deployment | null => {
    if (inputData && inputData.success) {
        //console.log(`The rest call was successful with a result of ${JSON.stringify(inputData)}`);
        const operations = inputData.deploymentOperations;
        const deployment: Deployment = {
            deploymentName: DeploymentConstants.defaultDeploymentName,
            deploymentOperations: operations.map(operation => mapOperationData(operation)),
        }
        return deployment;
    } else {
        console.log(`the rest call was not successful`);
        return null;
    }
}

