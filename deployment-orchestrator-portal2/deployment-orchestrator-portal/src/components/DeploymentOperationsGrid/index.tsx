import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Deployment, DeploymentOperation } from '../../models/deployment-models';

interface Props {
    data: Deployment | null;
}

export const DeploymentOperationsGrid = ({ data }: Props) => (
    <Container>
        <Row>
            <Col>Target Resource</Col>
            <Col>Resource Type</Col>
            <Col>Provisioning Operation</Col>
            <Col>Provisioning State</Col>
        </Row>
        {data?.deploymentOperations?.map((deploymentOperation) => {
            //if (deploymentOperation.provisioningState != 'Failed') {
                return (
                    <Row>
                        <Col>{deploymentOperation.targetResource}</Col>
                        <Col>{deploymentOperation.resourceType}</Col>
                        <Col>{deploymentOperation.provisioningOperation}</Col>
                        <Col>{deploymentOperation.provisioningState}</Col>
                    </Row>
                )
           // }
        })}
    </Container>
);