import React from 'react';
import Auxiliary from './Auxiliary';
import Header from './Header';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';

const Layout = (props) => {
    return (
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
                ></link>
            </Head>
            <Auxiliary>
                <Header />
                {props.children}
            </Auxiliary>
        </Container>
    );

}

export default Layout;