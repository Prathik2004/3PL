import ResetPasswordCard from "../components/ResetPasswordCard";
import InviteUserCard from "../components/userManagement/InviteUserCard";


export default function Home() {

  return (
    <h1 className="text-2xl font-semibold text-[#0F172A] p-10 space-y-5 min-h-screen flex items-center ">
     <InviteUserCard />
    </h1>
  );
}