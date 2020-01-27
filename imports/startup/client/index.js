import React from 'react';
import { Meteor } from 'meteor/meteor';
import { MeteorAccountsLink } from 'meteor/apollo'
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient } from 'apollo-client'

import UserProvider from '../../contexts/UserContext';
import App from '../../ui/App';

const client = new ApolloClient({
    link: ApolloLink.from([
      new MeteorAccountsLink({ headerName: 'meteor-login-token' }),
      new HttpLink({
        uri: '/graphql'
      })
    ]),
    cache: new InMemoryCache()
  })

    const ApolloApp = () => (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <UserProvider>
                    <App/>
                </UserProvider>
            </BrowserRouter>
        </ApolloProvider>
    )

Meteor.startup(()=>{
    render(<ApolloApp />, document.getElementById("app"));
});