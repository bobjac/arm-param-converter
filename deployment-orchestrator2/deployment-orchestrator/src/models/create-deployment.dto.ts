import { IsInt, IsString } from "class-validator";
import { DeploymentParams } from "./deployment-params";

export class DeploymentRequest {
    @IsString()
    readonly deploymentName: string;

    @IsString()
    readonly resourceGroup: string;

    public deploymentParams: DeploymentParams;
}
