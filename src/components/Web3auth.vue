<template>
  <div>
    <button @click="loginWithWeb3" v-if="!userAddress">Login with Web3</button>
    <p v-if="userAddress">Logged in as {{ userAddress }}</p>
  </div>
</template>

<script>
import { Web3Auth } from "@web3auth/modal";

export default {
  data() {
    return {
      userAddress: null,
    };
  },
  methods: {
    async loginWithWeb3() {
      const web3auth = new Web3Auth({
        clientId:
          "BIktCgUjD88Gt1XpSsK8ycLXQXXB5IiEgddBQPKPV202qFMjkmBLyb3O0O35KQ4awjCCudPToRfj2GqPrerI_Xs", // Get your Client ID from the Web3Auth Dashboard
        web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0x1",
          rpcTarget: "https://rpc.ankr.com/eth",
          displayName: "Ethereum Mainnet",
          blockExplorer: "https://goerli.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        },
      });

      try {
        await web3auth.initModal();
        await web3auth.connect();
      } catch (error) {
        console.log(error);
      }
      console.log("Initialised.....");
    },
  },
};
</script>
