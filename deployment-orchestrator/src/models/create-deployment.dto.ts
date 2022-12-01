import { IsInt, IsString } from "class-validator";

export class CreateDeploymentDto {
    @IsString()
    readonly deploymentName: string;

    @IsString()
    readonly resourceGroup: string;

    @IsString()
    readonly templateUri: string;

    @IsString()
    readonly parametersUri: string;
}