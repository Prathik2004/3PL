import Image from 'next/image'
import { useState } from 'react'
import BasicButton from './BasicButton'
import { shipmentService } from "@/src/services/shipmentService"

interface DeleteModalProps {
  shipmentId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const DeleteModal = ({ shipmentId, onClose, onSuccess }: DeleteModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await shipmentService.cancelShipment(shipmentId.replace('#', ''));
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to cancel shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50'>
      <div
        style={{
          fontFamily: "Inter"
        }}
        className='w-[30%] h-76 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-xl gap-5 p-8 '>

        <div className='w-16 h-16 rounded-full flex items-center justify-center bg-[#EE2B2B1A]'>
          <Image src="icons/redDelete.svg" alt="Delete" width={30} height={30} className='text-red-500' />
        </div>
        <span className='text-black text-[24px]/[32px] font-bold'>
          Delete Shipment
        </span>
        <span className='text-[14px]/[20px] text-[#64748B] text-center'>
          Are you sure you want to cancel {shipmentId}? This action will mark it as Cancelled.
        </span>
        {error && <span className="text-[12px] text-red-500 text-center">{error}</span>}
        <div className='flex items-center justify-evenly gap-3'>
          <BasicButton onClick={onClose} disabled={loading} text="Cancel" className='border border-[#E2E8F0] py-3 px-12 rounded-lg' />
          <BasicButton onClick={handleDelete} disabled={loading} text={loading ? "Deleting..." : "Delete"} className='bg-red-500 text-white py-3 px-12 rounded-lg' />
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
