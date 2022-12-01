import { DeploymentOperation, DeploymentsDeleteOptionalParams } from '@azure/arm-resources';
import {
    Controller,
    Get,
    Param,
    Put,
    Body,
    Post,
    UseInterceptors,
    UploadedFiles,
    UploadedFile,
    Res,
    Header,
    Delete,
    Query,
    BadRequestException,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { response } from 'express';
import { CreateDeploymentDto } from 'src/models/create-deployment.dto';
import { DeploymentService, IDeploymentResult } from 'src/service/deployment.service';

@Controller('deployments')
export class DeploymentController {
    private readonly logger = new Logger(DeploymentController.name);

    constructor(private readonly deploymentService: DeploymentService) {}

    @Get('/:resourceGroup/:deploymentName')
    async getDeployments(
                @Param('resourceGroup') resourceGroup: string, 
                @Param('deploymentName') deploymentName: string) {
        this.logger.log(`calling getDeployments with resourceGroup - ${resourceGroup} and deploymentName - ${deploymentName}`)
        let responseMessage: IDeploymentResult;
        let result: DeploymentOperation[] = [];
        try {
            result = await this.deploymentService.listDeploymentsOperations(resourceGroup, deploymentName);
        }
        catch (error) {
            this.logger.log(error);
        }

        responseMessage = {
            success: result ? true : false,
            deploymentOperations: result
        }

        return responseMessage;
    }

    @Post()
    async create(@Body() createDeployment: CreateDeploymentDto) {
        const records = this.deploymentService.loadParamsRecords();

        return this.deploymentService.createOrUpdateDeploymant(
            createDeployment.templateUri, 
            records,
            createDeployment.resourceGroup, 
            createDeployment.deploymentName);
    }
}