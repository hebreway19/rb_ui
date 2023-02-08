const sonarqubeScanner = require("sonarqube-scanner");
sonarqubeScanner(
  {
    serverUrl: process.env.SONARQUBE_SERVER,
    token: process.env.SONARQUBE_TOKEN
  },
  () => {},
);