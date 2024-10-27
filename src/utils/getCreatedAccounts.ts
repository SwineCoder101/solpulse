// utils/getCreatedAccounts.ts
import { Connection, PublicKey } from '@solana/web3.js';
import { AccountDTO, TypeDTO } from './idleParser';

interface AccountInfo {
  name: string;
  discriminator: string;
  fields: any[];
  files: any[];
}

interface AccountResponse {
  [key: string]: AccountInfo;
}

interface AccountType {
  account: AccountDTO;
  type: TypeDTO;
}

const getCreatedAccounts = async (
  connection: Connection,
  programId: string,
  accounts: AccountDTO[],
  types: TypeDTO[]
): Promise<AccountResponse> => {
  const result: AccountResponse = {};
  
  const accountTypes: AccountType[] = accounts.map((account, index) => {
    return {
      account,
      type: types[index],
    };
  });

  for (const account of accountTypes) {
    const name = account.account.name;
    const discriminator = account.account.discriminator ?? '';
    const fields = account.type.type.fields;

    try {
      const files = [...(await connection.getProgramAccounts(new PublicKey(programId), {
        dataSlice: { offset: 0, length: 0 },
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: discriminator,
            },
          },
        ],
      }))];
      result[name] = {
        name,
        discriminator,
        fields,
        files,
      };
    } catch (e) {
      console.error(`Error fetching accounts for ${name}:`, e);
    }
  }
  return result;
};

export default getCreatedAccounts;
