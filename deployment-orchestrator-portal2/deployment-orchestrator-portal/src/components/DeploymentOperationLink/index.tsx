import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './index.scss';
import { Deployment, DeploymentOperation } from '../../models/deployment-models';
import { DeploymentConstants, ResourceType, ProvisionState } from '../../constants/deployment.constants';
import { getResourceGroup, isFailure, isSuccessfulDeploymentType } from '../../data/DeploymentData';

interface Props {
    data: DeploymentOperation;
}

const getDeploymentOperationLinkPath = (deploymentOperation: DeploymentOperation): string => {
    const resourceGroup = getResourceGroup(deploymentOperation);
    return `/dashboard/${DeploymentConstants.defaultResourceGroup}/${deploymentOperation.targetResource}`;
}

export const DeploymentOperationLink = ({ data }: Props) => {
    if (isSuccessfulDeploymentType(data)) {
        return <NavLink to={getDeploymentOperationLinkPath(data)}>{data.provisioningState}</NavLink>;
    } else if (isFailure(data)){
        return <Link to="/deploymenterror" state={{ deploymentOperation: data}}>{data.provisioningState}</Link>
    } else {
        return <div>{data.provisioningState}</div>
    }
};