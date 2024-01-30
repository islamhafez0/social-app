import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetAllUsers } from "@/lib/react-query/QueriesNMutations";

const Users = () => {
  const { toast } = useToast();
  const { data: users, isError, isLoading } = useGetAllUsers();
  if (isError) {
    toast({ title: "Something went wrong." });
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {!users || isLoading ? (
          <div className="flex items-center justify-center w-full">
            <Loader />
          </div>
        ) : (
          <ul className="user-grid">
            {users?.documents?.map((user) => (
              <li key={user?.$id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Users;
