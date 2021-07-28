import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Router } from '../../../routes';

class NewRequest extends Component {
    state = {
        value: '',
        recepient: '',
        description: '',
        processingTransaction: false,
        errorMessage: ''
    }

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    onSubmitHandler = async event => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);

        this.setState({ processingTransaction: true, errorMessage: '' });

        try {
            const { description, value, recepient } = this.state;
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether')
                , recepient
            ).send({ from: accounts[0] });

            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });

        }
        this.setState({ processingTransaction: false });
    }



    render() {
        return (
            <Layout>
                <h3>Create Request!</h3>
                <Form onSubmit={this.onSubmitHandler} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input value={this.state.description} onChange={event => this.setState({ description: event.target.value })} />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in ether</label>
                        <Input value={this.state.value} onChange={event => this.setState({ value: event.target.value })} />
                    </Form.Field>
                    <Form.Field>
                        <label>Recepient</label>
                        <Input value={this.state.recepient} onChange={event => this.setState({ recepient: event.target.value })} />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.processingTransaction} primary>Create!</Button>
                </Form>


            </Layout>
        );
    }
}

export default NewRequest;