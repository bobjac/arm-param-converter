import { Deployment } from 'models/deployment-models';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import './index.scss';
import './deploymentcardgroup.scss';

import overViewIcon from './overview-icon.svg';
import { OverViewCard } from '../DeploymentOverviewCard';
import { DeploymentConstants, ResourceType, ProvisionState } from '../../constants/deployment.constants';
import { getResourceGroup, isSuccess, isFailure, isSuccessfulDeploymentType, isRunning } from '../../data/DeploymentData';

interface Props {
    data: Deployment | null;
}

export const DeploymentCardGroup = ({ data }: Props) => {
    console.log(`Inside DeploymentCardGroup with data - ${data}`);
    const sucessfulDeployments = data?.deploymentOperations?.filter(deploymentOperation => isSuccess(deploymentOperation));
    const failedDeployments = data?.deploymentOperations?.filter(deploymentOperation => isFailure(deploymentOperation));
    const runningDeployments = data?.deploymentOperations?.filter(deploymentOperation => isRunning(deploymentOperation));

    const onCardClick = (val: string) => {
        //props.setDocumentFilter(val);
        //loadOverViewData();
        console.log(`onCardClick click with a value of ${val}`);
    };

    return (
        <Container fluid className="overview">
            <Row className="m-b-20">
                <h2 className="page-header">Overview</h2>
            </Row>
            <div className="overview-container row">   
                <Col>
                    <OverViewCard 
                            selectedFilter="success"
                            key="success"
                            value="Successful Deployments"
                            onClick={val => onCardClick(val)}
                            title={sucessfulDeployments?.length.toString()}
                            subTitle="Successful Deployments"
                            image={overViewIcon}
                            className=" c-pointer"
                            color="green"
                    ></OverViewCard>
                </Col>
                <Col>
                    <OverViewCard 
                        selectedFilter="failure"
                        key="failure"
                        value="Failed Deployments"
                        onClick={val => onCardClick(val)}
                        title={failedDeployments?.length.toString()}
                        subTitle="Failed Deployments"
                        image={overViewIcon}
                        className=" c-pointer"
                        color="red"
                    ></OverViewCard>
                </Col>
                <Col>
                    <OverViewCard 
                        selectedFilter="running"
                        key="running"
                        value="Running Deployments"
                        onClick={val => onCardClick(val)}
                        title={runningDeployments?.length.toString()}
                        subTitle="Running Deployments"
                        image={overViewIcon}
                        className=" c-pointer"
                        color="grey"
                    ></OverViewCard>
                </Col>
            </div>
        </Container>
    );
};