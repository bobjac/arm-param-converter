export class DeploymentParams {
    resourceGroupLocation = "";
    resourceGroupName = "";
    projectDetailprefix = "";
    projectDetailenvironment = "";
    projectDetailproject = "";
    _artifactsLocation = "";
    _artifactsLocationSasToken = "";
    nestedTemplatesFolder = "";
    ownerRoleId = "";
    readerRoleId = "";
    appInsightsTemplateFileName = "";
    keyVaultTemplateFileName = "";
    resourecGroupType = "";
    appServicePlanType = "";
    functionAppType = "";
    webAppType = "";
    storageAccountType = "";
    appInsightsType = "";
    cosmosDBType = "";
    keyVaultType = "";
    cogService = "";
    machineLearningName = "";
    machineLearningDatastoreName = "";
    machineLearningCompute = "";
    signalR = "";
    containerRegistry = "";
    appInsightsName = "";
    appInsightsLocation = "";
    keyVaultName = "";
    keyVaultLocation = "";
    keyVaultSku = "";
    storageTemplateFileName = "";
    storageParametersFileNameTraining = "";
    mlStorageAccountName = "";
    mlStorageAccountSku = "";
    mlStorageLocation = "";
    trainingStorageName = "";
    trainingStorageSku = "";
    trainingStorageLocation = "";
    processingStorageName = "";
    processingStorageSku = "";
    processingStorageLocation = "";
    publishedStorageName = "";
    publishedStorageSku = "";
    publishedStorageLocation = "";
    storageBlobContainerTemplateFileName = "";
    roleAssignmentStorageTemplateFileName = "";
    roleAssignmentTemplateFileName = "";
    storageParametersFileNameProcessing = "";
    storageParametersFileNameProcessingPublished = "";
    storageQueueTemplateFileName = "";
    cosmosDBTemplateFileName = "";
    cosmosDBSQLDBTemplateFileName = "";
    cosmosDBName = "";
    cosmosDBLocation = "";
    cosmosDBLocationName = "";
    cosmosDBSQLDBContainerTemplateFileName = "";
    CosmosDBSQLDBContainerUDFTemplateFileName = "";
    appServicePlanTemplateFileName = "";
    webAppServicePlanName = "";
    webAppLocation = "";
    webAppName = "";
    webAppTemplateFileName = "";
    ZipDeployTemplateFileName = "";
    cognitiveServiceTemplateFileName = "";
    customVisionAuthoringName = "";
    customVisionPredictionName = "";
    customVisionLocation = "";
    computerVisionName = "";
    computerVisionLocation = "";
    formRecognizerName = "";
    formRecognizerLocation = "";
    luisAuthoringName = "";
    luisPredictionName = "";
    luisLocation = "";
    luisLocationAuthoring = "";
    signalRTemplateFileName = "";
    signalRName = "";
    signalRLocation = "";
    machineLearningTemplateFileName = "";
    machineLearningComputeTemplateFileName = "";
    machineLearningComputeLocation = "";
    machineLearningDataStoreTemplateFileName = "";
    functionAppTemplateFileName = "";
    functionAppConfigTemplateFileName = "";
    functionAppDipKeyTemplateFileName = "";
    orchestrationFunctionAppName = "";
    orchestrationHostingPlanName = "";
    orchestrationFunctionAppLocation = "";
    modulesFunctionAppName = "";
    modulesHostingPlanName = "";
    modulesFunctionAppLocation = "";
    keyVaultAccessPolicyFileName = "";
    keyVaultCurrentUserAccessPolicyFileName = "";
    keyVaultSecretTemplateFileName = "";
    customMLHostingPlanName = "";
    customMLFunctionAppLocation = "";
    customMLFunctionAppName = "";
    customMLFunctionAppKeyName = "";
    functionAppContainerTemplateFileName = "";
    customMLFunctionAppTemplateFileName = "";
    containerRegistryTemplateFileName = "";
    containerRegistryName = "";
    sourceContainerRegistryName = "";
    sourceContainerUserName = "";
    sourceContainerPassword = "";
    containerRegistryLocation = "";
    orchestrationFunctionAppSettingsTemplateFileName = "";
    modulesFunctionAppSettingsTemplateFileName = "";
    webAppSettingsTemplateFileName = "";
    STORAGE_CONTAINER_NAME_LOG = "";
    COMPUTER_VISION_VERSION_URL = "";
    scriptLUISTemplateFileName = "";
    scriptDataStoreTemplateFileName = "";
    scriptFunctionAppUrlKVTemplateFileName = "";
    scriptTextClassificationTemplateFileName = "";
    //jitAccessPolicyTEMP = "";
    deploymentUserObjectId = "";
    deploymentAssetPath = "";
    deploymentTemplatePath = "";
    deploymentConfigurationFileName = "";
    deploymentAssetModulesFileName = "";
    deploymentAssetWebAppFileName = "";
    deploymentAssetOrchFileName = "";
    deploymentAssetVersionNumber = "";
    isMarketPlaceDeployment = "";
}

export interface IDeploymentParams extends DeploymentParams, Record<string, unknown> { };

export type DeploymentParamsPropsArray = Array<keyof IDeploymentParams>;

export const propsArray: DeploymentParamsPropsArray = Object.keys(new DeploymentParams()) as DeploymentParamsPropsArray;

