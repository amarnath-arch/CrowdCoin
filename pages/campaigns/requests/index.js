import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import { Table } from 'semantic-ui-react';
import RequestRow from '../../../components/RequestRow';

class RequestsList extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestCount().call();
        const ApproversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );

        console.log(requests);

        return { address, requests, requestCount, ApproversCount };
    }


    renderRows = () => {
        const Rows = this.props.requests.map((request, index) => {
            return <RequestRow key={index} id={index} request={request} ApproversCount={this.props.ApproversCount} address={this.props.address} />
        });
        return Rows;
    }


    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button floated="right" style={{ marginBottom: "10px" }} primary>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>
                    <strong>{`Found ${this.props.requestCount} requests`}</strong>
                </div>
            </Layout >
        );
    }
}

export default RequestsList;