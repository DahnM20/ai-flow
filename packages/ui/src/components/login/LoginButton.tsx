import { CognitoHostedUIIdentityProvider, CognitoUser, Auth } from "@aws-amplify/auth";
import { memo } from "react";
import { FiLogIn } from "react-icons/fi";
import UserProfile from "./UserProfile";

interface LoginProps {
    user: any;
    onClickProfile?: () => void;
}

function LoginButton({ user, onClickProfile }: LoginProps) {

    function handleClickProfile() {
        if (!!onClickProfile) {
            onClickProfile();
        }
    }
    return (
        <>
            {
                !user
                    ? <button
                        className="text-slate-400 px-4 
                                   hover:text-slate-50
                                     flex flex-row items-center justify-center row space-x-2"
                        onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}>
                        <FiLogIn /> <span>Log in</span>
                    </button>
                    : <div className="w-9 mx-4 ">
                        <UserProfile user={user} handleClickProfile={handleClickProfile} />
                    </div>
            }
        </>
    )
}

export default memo(LoginButton);