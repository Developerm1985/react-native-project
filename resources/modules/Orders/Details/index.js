import React from 'react';
import * as Layout from '@components/Layout';
import { Map, InfoDrawer } from './components';

const OrderDetails = () => {
    return (
        <Layout.Wrapper
            style={{ backgroundColor: "#fff" }}
            statusBarProps={{
                translucent: true,
                backgroundColor: 'transparent'
            }}
        >
            <Layout.Scroll>
                <Map />
                <InfoDrawer />
            </Layout.Scroll>
        </Layout.Wrapper>
    );
};


export default OrderDetails;