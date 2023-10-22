import { Amplify } from "aws-amplify";

const configureAmplify = async () => {
    const useAuth = process.env.REACT_APP_USE_AUTH || 'false';

    if (useAuth.toLowerCase() === 'true') {
        // @ts-ignore
        import('./utils/aws-exports')
            .then((awsExports) => {
                Amplify.configure(awsExports.default);
            })
            .catch((error) => {
                console.error("Erreur lors de l'importation de aws-exports:", error);
            });
    }
};

export default configureAmplify;