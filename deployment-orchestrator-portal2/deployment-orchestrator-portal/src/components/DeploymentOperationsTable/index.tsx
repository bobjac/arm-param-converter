import React from 'react';
import Table from 'react-bootstrap/Table';
import './index.scss';
//import { ServiceHelper } from '../../lib/serviceHelper';
import { Deployment, DeploymentOperation } from '../../models/deployment-models';
import { DeploymentConstants, ResourceType, ProvisionState } from '../../constants/deployment.constants';
import { Link, NavLink } from 'react-router-dom';
import { DeploymentOperationsList } from '../DeploymentOperationsList';
import { DeploymentOperationLink } from '../DeploymentOperationLink';

interface Props {
    data: Deployment | null;
}

export const DeploymentOperationsTable = ({ data }: Props) => (
    <>
    <h2 className="page-header">Deployment Operations</h2>
    <Table striped bordered hover>
        <tbody>
        <tr>
                <th>Target Resource</th>
                <th>Resource Type</th>
                <th>Provisioning Operation</th>
                <th>Provisioning State</th>
            </tr>
        {data?.deploymentOperations?.map((deploymentOperation) => {
                return (
                    <tr>
                        <td>{deploymentOperation.targetResource}</td>
                        <td>{deploymentOperation.resourceType}</td>
                        <td>{deploymentOperation.provisioningOperation}</td>
                        <td><DeploymentOperationLink data={deploymentOperation}/></td>
                    </tr>
                )
        })}
        </tbody>
    </Table>
    </>
);