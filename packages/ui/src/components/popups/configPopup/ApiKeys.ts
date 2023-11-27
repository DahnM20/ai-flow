export type APIKeys = {
    openai_api_key?: string;
    stabilityai_api_key?: string;
};


export const defaultApiKeys: APIKeys = {
    openai_api_key: '',
    stabilityai_api_key: '',
}