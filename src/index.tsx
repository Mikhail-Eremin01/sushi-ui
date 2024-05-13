import React from "react"
import * as ReactDOM from "react-dom/client"
import axios from "axios"
import jwt_decode from "jwt-decode"
import { ApolloClient, ApolloProvider, createHttpLink, ApolloLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { TokenRefreshLink } from "apollo-link-token-refresh"
import { cache } from "./cache/cache"
import { IToken } from "./types/types"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import './i18n'

import "./index.css"

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("AccessToken");
  return {
    headers: {
      ...headers,
      authorization: token !== null ? token : "",
    },
  }
})

const refreshTokenLink = new TokenRefreshLink({
  isTokenValidOrUndefined: () => {
    const token = localStorage.getItem("AccessToken");
    if (token !== null) {
      const decoded = jwt_decode<IToken>(token);
      return decoded?.exp > Date.now() / 1000 ? true : false;
    } else {
      return true;
    }
  },
  fetchAccessToken: () => {
    const token = localStorage.getItem("AccessToken");
    if (token !== null) {
      return axios.post(`${process.env.REACT_APP_API_URL}/graphql`, {
        operationName: "refreshAuth",
        variables: { accessToken: token },
        query:
          "query refreshAuth($accessToken: String!) { refreshAuth(accessToken: $accessToken) { accessToken } }",
      });
    }
    return new Promise(() => null);
  },
  handleFetch: (accessToken) => {
    localStorage.setItem("AccessToken", accessToken);
  },
  handleResponse: (operation, accessTokenField) => (resp: any) => {
    return {
      access_token: resp?.data?.data?.refreshAuth?.accessToken || undefined,
    };
  },
  handleError: (err) => {
    console.log("handleError", err)
    localStorage.removeItem("AccessToken")
  },
})

const client = new ApolloClient({
    link: ApolloLink.from([refreshTokenLink, authLink, httpLink]),
    cache: cache,
    connectToDevTools: true
})

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
