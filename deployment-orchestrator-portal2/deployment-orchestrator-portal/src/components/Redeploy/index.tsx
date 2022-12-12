import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';

import { getDeploymentOperations, getMarketplaceSettings, getDeploymentParamValues } from "../../data/DeploymentData";
import { Deployment, DeploymentOperation, DeploymentParams, propsArray } from "../../models/deployment-models";

export const Redeploy = () => {
    const { deploymentName, deploymentResourceGroup } = useParams();
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [deploymentParams, setDeploymentParams] = React.useState<DeploymentParams>(new DeploymentParams());

    const onFormSubmit = e => {
        console.log('Inside onFormSubmit');
        e.preventDefault()
        const formData = new FormData(e.target),
              formDataObj = Object.fromEntries(formData.entries())
        console.log(formDataObj)
    }

    React.useEffect(() => {
        const deGetDeploymentParams = async() => {
            console.log(`Inside doGetDeploymentParams`);
            const deploymentParams = await getDeploymentParamValues(deploymentResourceGroup, deploymentName);
            console.log(`Inside Redeploy with deploymentParams of ${JSON.stringify(deploymentParams)}`);
            setDeploymentParams(deploymentParams);
            setLoaded(true);
        };
        deGetDeploymentParams();
    }, [deploymentName, deploymentResourceGroup]);
    return (

        <Form>
            <>
            { loaded && 
              deploymentParams &&
              propsArray &&
              Object.keys(deploymentParams).map(key=> {
                return (
                    <Form.Group className="mb-3" controlId={key.toString()}>
                    <Form.Label>{key}</Form.Label>
                    <Form.Control type="text" placeholder={deploymentParams[key]} />
                    {/* <Form.Text className="text-muted">{key}</Form.Text> */}
                </Form.Group>
                );
              })
            }
            <Button type="submit">Submit</Button>
            </>
        </Form>
    );
}