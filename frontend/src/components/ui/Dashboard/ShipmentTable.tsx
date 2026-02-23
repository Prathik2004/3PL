import { ShipmentRowProps } from "@/src/types/types";
import ShipmentRow from "./ShipmentRow"

export const shipments: ShipmentRowProps[] = [
  {
    shipmentId: "#SHP-98231",
    client: "Alpha Retail Solutions",
    lastUpdated: "3hrs",
    carrier: "FedEx Ground",
    dest: "Austin, TX",
    expDel: "24/10 14:00",
    alert: "-",
    alertColor: "None",
    status: "IN TRANSIT",
  },
  {
    shipmentId: "#SHP-98245",
    client: "Zion Logistics Group",
    lastUpdated: "52hrs",
    carrier: "UPS Express",
    dest: "Chicago, IL",
    expDel: "24/10 14:00",
    alert: "NO UPDATE",
    alertColor: "Yellow",
    status: "DISPATCHED",
  },
  {
    shipmentId: "#SHP-98250",
    client: "Metro Food Dist.",
    lastUpdated: "1hr",
    carrier: "DHL Global",
    dest: "Seattle, WA",
    expDel: "25/10 10:00",
    alert: "-",
    alertColor: "None",
    status: "DISPATCHED",
  },
  {
    shipmentId: "#SHP-98255",
    client: "Summit Outfitter",
    lastUpdated: "4hrs",
    carrier: "FedEx Ground",
    dest: "New York, NY",
    expDel: "22/10 16:45",
    alert: "MISSING POD",
    alertColor: "Yellow",
    status: "DELIVERED",
  },
  {
    shipmentId: "#SHP-98260",
    client: "Global Tech Parts",
    lastUpdated: "1hr",
    carrier: "Regional Xpress",
    dest: "Denver, CO",
    expDel: "21/10 09:00",
    alert: "-",
    alertColor: "Red",
    status: "DELAYED",
  },
];

const ShipmentTable = () => {
  return (
    <div
    style={{
        fontFamily: "Inter"
    }} 
    className="w-279.5 max-h-screen bg rounded-2xl border border-[#E2E8F0] flex flex-col items-center justify-center bg-[#F5F9FF] relative overflow-x-auto">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center text-[#64748B] text-[12px] font-bold  h-[65.5px] w-full rounded-t-xl">
            <span className="flex-wrap">
                SHIPMENT ID & CLIENT        
            </span>
            <span>
                CARRIER            
            </span>
            <span>
                DESTINATION
            </span>
            <span className="flex-wrap">
                EXP. DELIVERY
            </span>
            <span>
                STATUS
            </span>
            <span>
                ALERTS
            </span>
            <span>
                ACTIONS
            </span>
        </div>
        {/* TABLE CONTENT */}
        <main>
        {
            shipments?.map((shipment, idx)=>(
                <div key={idx}>
                    <ShipmentRow shipmentId={shipment.shipmentId} client={shipment.client} expDel={shipment.expDel} lastUpdated={shipment.lastUpdated} carrier={shipment.carrier} dest={shipment.dest} alert={shipment.alert} alertColor={shipment.alertColor} status={shipment.status}   />
                </div>
            ))
        }
        </main>
        {/* TABLE FOOTER */}
        <div 
        className="flex items-center justify-evenly text-[#64748B] text-[12px] bg- w-full p-2">
            <span className="flex items-center justify-center gap-1">
                SHOWING
                {/* TODO: Number of rows being shown */}
                <span className="text-black"> 1-5 </span>
                OF 
                {/* TODO: Total number of rows */}
                <span className="text-black">
                    1240
                </span>
                    SHIPMENTS
            </span>
            <span>
                PAGINATIONS
            </span>
        </div>
    </div>
  )
}

export default ShipmentTable
