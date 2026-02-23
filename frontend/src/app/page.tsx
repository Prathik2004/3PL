import BasicInput from "../components/ui/BasicInput";
import DeleteModal from "../components/ui/DeleteModal";

export default function Home() {
  return (
    <h1 className="text-2xl font-semibold text-[#0F172A] p-10 space-y-5 min-h-screen">

      <BasicInput text="SHIPMENT ID" />
    </h1>
  );
}