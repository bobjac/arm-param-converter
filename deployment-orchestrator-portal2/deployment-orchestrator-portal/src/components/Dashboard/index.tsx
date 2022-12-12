import React from 'react';
import { useParams } from 'react-router-dom';
import { getDeploymentOperations, getMarketplaceSettings } from "../../data/DeploymentData";
import { Deployment, DeploymentOperation, DeploymentParams } from "../../models/deployment-models";
import { DeploymentOperationsGrid } from '../DeploymentOperationsGrid';
import { DeploymentCardGroup} from '../DeploymentCardGroup';
import { DeploymentOperationsTable } from '../DeploymentOperationsTable';
import { DeploymentConstants } from '../../constants/deployment.constants';
import { IDeploymentReference } from '../../view-models/deployment-status-models';


export const Dashboard = () => {
    const { deploymentName, deploymentResourceGroup } = useParams();
    const [azureDeployment, setAzureDeployment] = React.useState<Deployment | null>(null);
    const [deploymentParams, setDeploymentParams] = React.useState<DeploymentParams | null>(null);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [deploymentReference, setDeploymentReference] =  React.useState<IDeploymentReference | null>({deploymentName: deploymentName, resourceGroup: deploymentResourceGroup});
    
    React.useEffect(() => {
        const deGetDeploymentParams = async() => {
            const deploymentParams = await getMarketplaceSettings();
            setDeploymentParams(deploymentParams);
        };
        const doGetDeploymentOperations = async (resourceGroup: string, deploymentName: string) => {
            console.log(`Inside doGetDeploymentOperations with resourceGroup: ${resourceGroup} & deploymentName: ${deploymentName}`);
            const deployment = await getDeploymentOperations(resourceGroup, deploymentName);
            console.log(`deployment - ${JSON.stringify(deployment)}`);
            setAzureDeployment(deployment);
        };
        console.log(`Inside Dashboard:useEffect with a deploymentName of ${deploymentName} and deploymentResourceGroup of ${deploymentResourceGroup}`);
        if (!loaded) {
            deGetDeploymentParams();
        }
        doGetDeploymentOperations(deploymentName, deploymentResourceGroup);
        setLoaded(true);
    }, [deploymentName,deploymentResourceGroup]);
    return (
        <>
            <DeploymentCardGroup data={azureDeployment}/>
            <br />
            <DeploymentOperationsTable data={azureDeployment} />
        </>
    );
};


