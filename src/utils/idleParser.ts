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
    return {
        address: json?.address ?? '',
        data: {
            address: json?.data?.address ?? '',
            metadata: {
                name: json?.data?.metadata?.name ?? '',
                version: json?.data?.metadata?.version ?? '',
                spec: json?.data?.metadata?.spec ?? '',
                description: json?.data?.metadata?.description ?? ''
            },
            instructions: json?.data?.instructions?.map((instruction: any) => ({
                name: instruction?.name ?? '',
                discriminator: instruction?.discriminator ?? [],
                accounts: instruction?.accounts?.map((account: any) => ({
                    name: account?.name ?? '',
                    writable: account?.writable ?? false,
                    signer: account?.signer ?? false,
                    address: account?.address ?? '',
                    relations: account?.relations ?? [],
                    pda: account?.pda ? {
                        seeds: account?.pda?.seeds?.map((seed: any) => ({
                            kind: seed?.kind ?? '',
                            value: seed?.value ?? [],
                            path: seed?.path ?? '',
                            account: seed?.account ?? ''
                        })) ?? []
                    } : undefined
                })) ?? [],
                args: instruction?.args?.map((arg: any) => ({
                    name: arg?.name ?? '',
                    type: arg?.type ?? ''
                })) ?? []
            })) ?? [],
            accounts: json?.data?.accounts?.map((account: any) => ({
                name: account?.name ?? '',
                discriminator: account?.discriminator ?? []
            })) ?? [],
            errors: json?.data?.errors?.map((error: any) => ({
                code: error?.code ?? 0,
                name: error?.name ?? '',
                msg: error?.msg ?? ''
            })) ?? [],
            types: json?.data?.types?.map((type: any) => ({
                name: type?.name ?? '',
                type: {
                    kind: type?.type?.kind ?? '',
                    fields: type?.type?.fields?.map((field: any) => ({
                        name: field?.name ?? '',
                        type: field?.type ?? ''
                    })) ?? []
                }
            })) ?? []
        },
        executable: json?.executable ?? false,
        lamports: json?.lamports ?? 0,
        owner: json?.owner ?? '',
        rentEpoch: json?.rentEpoch ?? 0,
        space: json?.space ?? 0
    };
}