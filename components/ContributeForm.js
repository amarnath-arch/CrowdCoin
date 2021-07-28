import Routes from 'next-routes';
import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';



class ContributeForm extends Component {

    state = {
        value: '',
        errorMessage: '',
        processingTransaction: false
    }

    onSubmitHandler = async event => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);

        console.log(campaign);

        this.setState({ processingTransaction: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${this.props.address}`);

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ processingTransaction: false, value: '' });



    }


    render() {
        return (
            <Form onSubmit={this.onSubmitHandler} error={!!this.state.errorMessage} >
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="ether" labelPosition="right" />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.processingTransaction} primary>Contribute!</Button>
            </Form>
        );
    }
}


export default ContributeForm;