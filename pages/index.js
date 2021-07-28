import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';


class CampaignIndex extends Component {
    static async getInitialProps() {
        const Campaigns = await factory.methods.getDeployedContracts().call();
        return { Campaigns };
    }

    renderCampaigns = () => {
        // console.log(this.props.Campaigns);
        const items = this.props.Campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        // console.log(items);
        // return items;

        return <Card.Group items={items} />;
    }


    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button
                                floated="right"
                                content="Create Campaign"
                                icon="add circle"
                                primary
                            />
                        </a>
                    </Link>
                    {this.renderCampaigns()}

                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;