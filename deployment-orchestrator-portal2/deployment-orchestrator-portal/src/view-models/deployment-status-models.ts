export interface IDeploymentStatusResponse {
    deploymentName: string;
    runtimeStatus: string;
}

export interface IDeploymentStatusRequest {
    resourceGroup: string;
    deploymentName: string;
}

export interface IDeploymentReference {
    resourceGroup: string;
    deploymentName: string;
}

