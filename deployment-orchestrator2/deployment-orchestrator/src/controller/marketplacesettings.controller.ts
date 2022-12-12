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
import { DeploymentParams } from 'src/models/deployment-params';
import { DeploymentService } from 'src/service/deployment.service';

@Controller('marketplacesettings')
export class MarketplaceSettingsController {
    private readonly logger = new Logger(MarketplaceSettingsController.name);

    constructor(private readonly deploymentService: DeploymentService) {}

    @Get()
    async getMarketplaceSettings() {
        return this.deploymentService.loadParams();
    }

    @Get('/:resourceGroup/:deploymentName')
    async getLatestParams(
        @Param('resourceGroup') resourceGroup: string, 
        @Param('deploymentName') deploymentName: string) {
        //todo: add parameter validation and pass to service
        return this.deploymentService.getLatestDeploymentParamValues();
    }
}