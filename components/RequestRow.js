import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class RequestRow extends Component {

    state = {
        approving: false,
        finalizing: false,
        errorMessage: ''
    }

    approveRequestHandler = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({ approving: true });

        const accounts = await web3.eth.getAccounts();


        try {
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ approving: false });



    }

    finalizeRequestHandler = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({ finalizing: true });

        const accounts = await web3.eth.getAccounts();


        try {
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ finalizing: false });

    }


    render() {
        const { Row, Cell } = Table;
        const { id, request, ApproversCount } = this.props;
        const readytoFinalize = request.approvalsCount > (ApproversCount / 2);
        return (
            <Row disabled={request.complete} positive={readytoFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description} </Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')} </Cell>
                <Cell>{request.recepient} </Cell>
                <Cell>{request.approvalsCount}/{ApproversCount} </Cell>
                <Cell><Button color="green" basic onClick={this.approveRequestHandler}>{this.state.approving ? "Approving...." : "Approve"}</Button></Cell>
                <Cell><Button color="red" basic onClick={this.finalizeRequestHandler} >{this.state.finalizing ? "Finalizing..." : "Finalize"}</Button></Cell>
            </Row>

        );
    }
}

export default RequestRow;