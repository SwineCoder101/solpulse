import { useEffect, useState } from 'react';
import getNetwork from '@/utils/getNetwork';
import { Connection } from '@solana/web3.js';

const useConnection = (network: string) => {
  const [connection, setConnection] = useState<Connection>(() => getNetwork(network));

  useEffect(() => {
    if (network) {
      const networkConfig = getNetwork(network);
      setConnection(networkConfig);
    }
  }, [network]);

  return connection;
};

export default useConnection;