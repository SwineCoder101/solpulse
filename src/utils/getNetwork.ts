interface Network {
  rpc: string;
  wss: string;
}

const getNetwork = (network: string): Network => {
  let rpc = '';
  let wss = '';
  switch (network) {
    case 'localnet':
      rpc = process.env.NEXT_PUBLIC_APP_LOCALNET_RPC || '';
      wss = process.env.NEXT_PUBLIC_APP_LOCALNET_WSS || ''; 
      break;
    case 'devnet':
      rpc = process.env.NEXT_PUBLIC_APP_DEVNET_RPC || '';
      wss = process.env.NEXT_PUBLIC_APP_DEVNET_WSS || ''; 
      break;
    case 'mainnet':
      rpc = process.env.NEXT_PUBLIC_APP_MAINNET_RPC || '';
      wss = process.env.NEXT_PUBLIC_APP_MAINNET_WSS || ''; 
      break;
  }
  return {rpc, wss};
};

export default getNetwork;
