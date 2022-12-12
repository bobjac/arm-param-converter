import React from 'react';
import { ServiceHelper } from '../../lib/serviceHelper';
import { Deployment, DeploymentOperation } from '../../models/deployment-models';

interface Props {
    data: Deployment;
}

export const DeploymentOperationsList = ({ data }: Props) => (
    <ul>
        {data?.deploymentOperations?.map((deploymentOperation) => (
            <li key={deploymentOperation.operationId}>
                {deploymentOperation.targetResource} - {deploymentOperation.provisioningState}
            </li>
        ))}
    </ul>
);
