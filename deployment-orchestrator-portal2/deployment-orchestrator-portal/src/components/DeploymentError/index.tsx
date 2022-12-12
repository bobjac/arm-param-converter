import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import { DeploymentOperation } from '../../models/deployment-models';
import { Button } from 'react-bootstrap';
import { postDeployment } from '../../data/DeploymentData'
import { DeploymentConstants } from '../../constants/deployment.constants';

interface Props {
    data: DeploymentOperation
}

export const DeploymentError = () => {
    let location = useLocation();
    let navigate = useNavigate();
    const  { deploymentOperation }  = location.state;
    const faultyOperation = deploymentOperation as DeploymentOperation
    console.log(`Inside DeploymentError with location data of ${JSON.stringify(faultyOperation)}`);

    const handleRedeploy = async (deploymentOperation: DeploymentOperation) => {
        console.log(`Redeploy clicked`);
        // const resourceGroup = getResourceGroup(deploymentOperation);
        // console.log(`Returned resourceGroup - ${resourceGroup}`);
        // const result = await postDeployment(resourceGroup, deploymentOperation.targetResource);
        // console.log(`result - ${JSON.stringify(result)}`);
        //let navigate = useNavigate();
        navigate(`/redeploy/${DeploymentConstants.defaultResourceGroup}/${DeploymentConstants.defaultDeploymentName}`);
    }
    
    const getResourceGroup = (deploymentOperation: DeploymentOperation): string => {
        console.log('Inside getResourceGroup')
        const operationId = deploymentOperation?.operationId;
        if (operationId) {
            const stringToCheck = 'resourceGroups/';
            const index = operationId.indexOf(stringToCheck);
            if (index > -1) {
                console.log(`first index - ${index}`);
                console.log(`character at first index - ${operationId[index]}`);
                const index2 = operationId.indexOf('/', (index + stringToCheck.length));
                console.log(`second index - ${index2}`);
                console.log(`character at second index - ${operationId[index2]}`);
                const rg = operationId.substring(index + stringToCheck.length, index2);
                return rg;
            }
        }
        return "";
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>{faultyOperation.targetResource} - Errors</Card.Title>
                <Card.Text>
                    {faultyOperation.errors ?? faultyOperation.errors[0]}
                </Card.Text>
                <span><Button variant="primary" onClick={() => navigate(-1)}>Return</Button></span>
                <span><Button variant="primary" onClick={() => handleRedeploy(faultyOperation)}>Redeploy</Button></span>
            </Card.Body>
        </Card>
    )
};