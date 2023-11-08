<template>
  <div v-if="!islogin">
    <h1>Wel come</h1>
    <button @click="initialise">Initialise</button>
    <button @click="login">Login</button>
  </div>
  <div v-else>
    <h1>Log in successfully</h1>
    <button @click="logout">Logout</button> <br />
    <br />
    <button @click="authenticateUser">IDToken</button><br />
    <br />
    <button @click="getUserInfo">getUserInfo</button><br />
    <br />
    <button @click="showWCM">showWCM</button><br />
    <br />
    <button @click="initiateTopUp">initiateTopUp</button><br />
    <br />
    <button @click="getChainId">getChainId</button><br />
    <br />
    <button @click="addChain">addChain</button><br />
    <br />
    <button @click="getAccounts">getAccounts</button><br />
    <br />
    <button @click="getBalance">getBalance</button><br />
    <br />
    <button @click="sendTransaction">sendTransaction</button><br />
    <br />
    <button @click="getPrivateKey">getPrivateKey</button><br />
    <br />
  </div>
</template>

<script>
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

const clientId =
  "BIktCgUjD88Gt1XpSsK8ycLXQXXB5IiEgddBQPKPV202qFMjkmBLyb3O0O35KQ4awjCCudPToRfj2GqPrerI_Xs";

export default {
  name: "HomeComponent",
  data() {
    return {
      web3auth: null,
      provider: null,
      islogin: false,
    };
  },
  methods: {
    async initialise() {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x1",
          rpcTarget: "https://rpc.ankr.com/eth",
          displayName: "Ethereum Mainnet",
          blockExplorer: "https://etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        };
        const web3auth = new Web3AuthNoModal({
          clientId,
          chainConfig,
          web3AuthNetwork: "sapphire_devnet",
          useCoreKitKey: false,
        });
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            loginConfig: {
              jwt: {
                verifier: "web3auth_jwt_demo",
                typeOfLogin: "jwt",
                clientId,
              },
            },
          },
          privateKeyProvider,
        });
        web3auth.configureAdapter(openloginAdapter);

        const torusPlugin = new TorusWalletConnectorPlugin({
          torusWalletOpts: {},
          walletInitOptions: {
            whiteLabel: {
              theme: { isDark: true, colors: { primary: "#00a8ff" } },
              logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            },
            useWalletConnect: true,
          },
        });

        await web3auth.addPlugin(torusPlugin);

        this.web3auth = web3auth;

        await web3auth.init();
        console.log(web3auth);
        // // setProvider(web3auth.provider);
        this.provider = web3auth.provider;
        if (web3auth.connected) {
          //   //   setLoggedIn(true);
          this.islogin = true;
          console.log("initialised");
        } else {
          console.log("hello");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getidtoken() {
      // Get ID Token from server
      const res = await fetch("http://localhost:8081/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data?.token;
    },

    async login() {
      if (!this.web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      // if (!this.web3auth.connected) {
      //   await this.web3auth.logout();
      //   this.islogin = false;
      //   return;
      // }
      const idToken = await this.getidtoken();
      console.log(idToken);

      const web3authProvider = await this.web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: "jwt",
          extraLoginOptions: {
            id_token: idToken,
            verifierIdField: "email",
            domain: "http://localhost:8080",
          },
        }
      );
      this.provider = web3authProvider;
      console.log("success");
      this.islogin = true;
    },
    async logout() {
      if (!this.web3auth) {
        console.log("Not initialised");
        return;
      }
      await this.web3auth.logout();
      this.islogin = false;
      this.provider = null;
    },
  },
};
</script>
