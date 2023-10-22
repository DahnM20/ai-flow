import { Amplify } from "aws-amplify";

const configureAmplify = async () => {
    const useAuth = process.env.REACT_APP_USE_AUTH || 'false';

    if (useAuth.toLowerCase() === 'true') {
        // @ts-ignore
        const awsExports = await import("./aws-exports");
        Amplify.configure(awsExports.default);
    }
};

export default configureAmplify;