export interface StatusIconProps{
    // text: "In Transit" | "Dispatched" | "Delayed" | "Created" | "Delivered"
    text: string
}

export interface ShipmentRowProps{
    shipmentId: string;
    client: string;
    lastUpdated: string;
    carrier: string;
    dest: string;
    // expDel: Date;
    expDel: string
    alert: string;
    alertColor?: "Yellow" | "Red" | "None";
    status: string
}

export interface ModalProps{
    onClose: ()=> void
}

export type Roles="Viewer" | "Operations" | "Admin";