export type APIKeys = {
    openai_api_key?: string;
    stabilityai_api_key?: string;
    replicate_api_key?: string;
};


export const defaultApiKeys: APIKeys = {
    openai_api_key: undefined,
    stabilityai_api_key: undefined,
    replicate_api_key: undefined,
}