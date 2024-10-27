// Define TypeScript interfaces

export interface MetadataDTO {
    name: string;
    version: string;
    spec: string;
    description: string;
}

export interface PDASeedDTO {
    kind: string;
    value?: number[];
    path?: string;
    account?: string;
}

export interface AccountDTO {
    name: string;
    writable?: boolean;
    signer?: boolean;
    address?: string;
    relations?: string[];
    discriminator?: string;
    pda?: {
        seeds: PDASeedDTO[];
    };
}

export interface ArgDTO {
    name: string;
    type: string | { vec: string };
}

export interface InstructionDTO {
    name: string;
    discriminator: number[];
    accounts: AccountDTO[];
    args: ArgDTO[];
}

export interface TypeFieldDTO {
    name: string;
    type: string;
}

export interface TypeDTO {
    name: string;
    type: {
        kind: string;
        fields: TypeFieldDTO[];
    };
}

export interface ErrorDTO {
    code: number;
    name: string;
    msg: string;
}

export interface DataDTO {
    address: string;
    metadata: MetadataDTO;
    instructions: InstructionDTO[];
    accounts: AccountDTO[];
    errors: ErrorDTO[];
    types: TypeDTO[];
}

export interface ProgramDTO {
    name?: string;
    address: string;
    data: DataDTO;
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch: number;
    space: number;
}

// Create a parser function
export function parseProgram(json: any): ProgramDTO {
    console.log("JSON IDL: ", json);

    if (!json || typeof json !== 'object') {
        throw new Error("Invalid JSON input");
    }

    return {
        name: json?.data?.metadata?.name ?? '',
        address: json?.address ?? '',
        data: {
            address: json?.data?.address ?? '',
            metadata: {
                name: json?.data?.metadata?.name ?? '',
                version: json?.data?.metadata?.version ?? '',
                spec: json?.data?.metadata?.spec ?? '',
                description: json?.data?.metadata?.description ?? ''
            },
            instructions: Array.isArray(json?.data?.instructions)
                ? json.data.instructions.map((instruction: any) => ({
                    name: instruction?.name ?? '',
                    discriminator: instruction?.discriminator ?? [],
                    accounts: Array.isArray(instruction?.accounts)
                        ? instruction.accounts.map((account: any) => ({
                            name: account?.name ?? '',
                            writable: !!account?.writable,
                            signer: !!account?.signer,
                            address: account?.address ?? '',
                            relations: account?.relations ?? [],
                            pda: account?.pda ? {
                                seeds: Array.isArray(account.pda.seeds)
                                    ? account.pda.seeds.map((seed: any) => ({
                                        kind: seed?.kind ?? '',
                                        value: seed?.value ?? [],
                                        path: seed?.path ?? '',
                                        account: seed?.account ?? ''
                                    }))
                                    : []
                            } : undefined
                        }))
                        : [],
                    args: Array.isArray(instruction?.args)
                        ? instruction.args.map((arg: any) => ({
                            name: arg?.name ?? '',
                            type: typeof arg?.type === 'string' ? arg.type : { vec: arg?.type?.vec ?? '' }
                        }))
                        : []
                }))
                : [],
            accounts: Array.isArray(json?.data?.accounts)
                ? json.data.accounts.map((account: any) => ({
                    name: account?.name ?? '',
                    discriminator: account?.discriminator ?? ''
                }))
                : [],
            errors: Array.isArray(json?.data?.errors)
                ? json.data.errors.map((error: any) => ({
                    code: error?.code ?? 0,
                    name: error?.name ?? '',
                    msg: error?.msg ?? ''
                }))
                : [],
            types: Array.isArray(json?.data?.types)
                ? json.data.types.map((type: any) => ({
                    name: type?.name ?? '',
                    type: {
                        kind: type?.type?.kind ?? '',
                        fields: Array.isArray(type?.type?.fields)
                            ? type.type.fields.map((field: any) => ({
                                name: field?.name ?? '',
                                type: field?.type ?? ''
                            }))
                            : []
                    }
                }))
                : []
        },
        executable: !!json?.executable,
        lamports: json?.lamports ?? 0,
        owner: json?.owner ?? '',
        rentEpoch: json?.rentEpoch ?? 0,
        space: json?.space ?? 0
    };
}

// Utility function to generate a formatted string for instruction content
export const formatInstructionContent = (instructions: InstructionDTO[]): string => {
    return instructions.map((instruction) => {
      const accounts = instruction.accounts.map(account => `  - ${account.name} (Writable: ${account.writable}, Signer: ${account.signer})`).join('\n');
      const args = instruction.args.map(arg => `  - ${arg.name}: ${typeof arg.type === 'string' ? arg.type : 'vec<${arg.type.vec}> '}`).join('\n');
      return `Instruction: ${instruction.name}\nAccounts:\n${accounts}\nArgs:\n${args}\n`;
    }).join('\n\n');
  };
  
  // Utility function to generate a formatted string for account content
  export const formatAccountContent = (accounts: AccountDTO[]): string => {
    return accounts.map((account) => {
      const pdaInfo = account.pda ? `PDA: Yes\nSeeds: ${account.pda.seeds.map(seed => `  - Kind: ${seed.kind}, Path: ${seed.path ?? 'N/A'}, Value: ${seed.value?.join(', ') ?? 'N/A'}`).join('\n')}` : 'PDA: No';
      return `Account: ${account.name}\nWritable: ${account.writable}\nSigner: ${account.signer}\n${pdaInfo}\n`;
    }).join('\n\n');
};
