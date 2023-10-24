import { Amplify } from "aws-amplify";

const configureAmplify = async () => {
    const useAuth = process.env.REACT_APP_USE_AUTH || 'false';

    if (useAuth === 'true') {
        let awsExports;
        try {
            awsExports = require('./aws-exports');
        } catch (err) {
            console.error("aws-exports.js not found");
        }

        if (awsExports) {
            Amplify.configure(awsExports);
        }
    }

};

export default configureAmplify;