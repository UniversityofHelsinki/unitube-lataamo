# React client for unitube lataamo

## Local installation and running with a local proxy

Client uses REACT_APP_LATAAMO_PROXY_SERVER environment variable. For local development it is set in the env.development.local file. For this to work you need to have [unitube-lataamo-proxy](https://version.helsinki.fi/tike-ohtu/unitube-lataamo-proxy) running locally.
- Create env.development.local file to the project root with REACT_APP_LATAAMO_PROXY_SERVER variable to the local proxy<br>
  `echo "REACT_APP_LATAAMO_PROXY_SERVER=http://localhost:3000" > .env.development.local`
- Install dependencies and start the react app <br>
  `npm install && npm start`
