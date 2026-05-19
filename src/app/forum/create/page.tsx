import PrivilegeGuard from "@/src/components/PrivilegeGuard";
import RawCreatePostPage from "./CreatePostPage";

export default function CreatePostPage() {
    return (
        <PrivilegeGuard requiredPrivilege="forum:create">
            <RawCreatePostPage />
        </PrivilegeGuard>
    );
}