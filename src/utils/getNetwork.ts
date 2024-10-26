const getNetwork = (network: string): {} => {
  let rpc = '';
  let wss = '';
  switch (network) {
    case 'localnet':
      rpc = process.env.NEXT_PUBLIC_APP_LOCALNET_RPC || '';
      wss = process.env.NEXT_PUBLIC_APP_LOCALNET_WS || ''; 
      break;
    case 'devnet':
      rpc = process.env.NEXT_PUBLIC_APP_DEVNET_RPC || '';
      wss = process.env.NEXT_PUBLIC_APP_DEVNET_WS || ''; 
      break;
    case 'mainnet':
      rpc = process.env.NEXT_PUBLIC_APP_MAINNET_RPC || '';
      wss = process.env.NEXT_PUBLIC_APP_MAINNET_WS || ''; 
      break;
  }
  return {rpc, wss};
};

export default getNetwork;
