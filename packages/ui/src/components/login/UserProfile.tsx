import { memo } from "react";

interface UserProfileProps {
    user: any;
    handleClickProfile?: () => void;
}

function UserProfile({ user, handleClickProfile }: UserProfileProps) {
    return <img className={`rounded-full border-2 border-[#86F0C2] ${!!handleClickProfile ? "hover:ring-2 cursor-pointer" : ""}`}
        src={user?.attributes?.picture}
        onClick={handleClickProfile} />
}

export default memo(UserProfile);