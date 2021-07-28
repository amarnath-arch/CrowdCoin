import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class NewCampaign extends Component {
    state = {
        minContribution: '',
        errorMessage: '',
        processingTransaction: false
    }

    formSubmitHandler = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({ processingTransaction: true, errorMessage: '' });

        try {
            await factory.methods.createCampaign(this.state.minContribution).send({
                from: accounts[0]
            });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ processingTransaction: false });

    }

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.formSubmitHandler} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input label='wei' labelPosition="right"
                            value={this.state.minContribution}
                            onChange={event => this.setState({ minContribution: event.target.value })}
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />

                    <Button loading={this.state.processingTransaction} primary>Create!</Button>

                </Form>
            </Layout>
        );
    }
}

export default NewCampaign;