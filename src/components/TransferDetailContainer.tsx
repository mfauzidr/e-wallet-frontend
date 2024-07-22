import { useState, useEffect } from 'react';
import PeopleDetailCard from '../components/PeopleDetailCard';
import moneyIcon from '../assets/icons/u_money-bill.svg';
import EnterPinModal from '../components/EnterPinModal';
import TransferSuccessModal from '../components/TransferSuccess';
import TransferFailedModal from '../components/TransferFailed';
import { peopleData } from './TransferListContainer';
import { useNavigate } from 'react-router-dom';

interface TransferDetailContainerProps {
  personId: number;
  onResetStep: () => void;
  onFinish: () => void;
  onTransferAgain: () => void; // Add the new prop
}

function TransferDetailContainer({ personId, onFinish, onTransferAgain }: TransferDetailContainerProps) {
  const [person, setPerson] = useState<typeof peopleData[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);

  useEffect(() => {
    // Fetch or filter the person data based on personId
    const selectedPerson = peopleData.find((p: { id: number }) => p.id === personId);
    setPerson(selectedPerson || null);
  }, [personId]);

  const handleSuccess = () => {
    setShowSuccessModal(true);
    setIsModalOpen(false);
    onFinish(); // Call onFinish to move to step 3
  };

  const handleFailure = () => {
    setShowFailedModal(true);
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const handleTryAgain = () => {
    onTransferAgain(); // Call the callback to reset step and navigate
    navigate("/user/transfer");
  };

  const handleDashboard = () => {
    navigate("/");
  };

  if (!person) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:border md:mr-8 p-7 gap-3 md:gap-6">
      <div className="flex flex-col font-semibold gap-4">
        <div className="text-xs md:text-base">People Information</div>
        <PeopleDetailCard image={person.image} name={person.name} phoneNumber={person.phoneNumber} favoriteIcon={person.favorite} isVerified={true} />
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-sm md:text-base font-semibold">Amount</div>
        <div className="text-xs md:text-sm text-gray-500 mb-4">Type the amount you want to transfer and then press continue to the next steps.</div>
        <div className="relative flex items-center">
          <img src={moneyIcon} alt="Money Icon" className="absolute left-3 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
          <input type="text" name="nominal" className="pl-10 border rounded-md focus:outline-gray-400 w-full h-10 md:h-12 text-sm md:text-base font-normal md:font-semibold" placeholder="Enter Nominal Transfer" autoComplete="off" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm md:text-base font-semibold">Notes</div>
        <div className="text-sm text-gray-500 mb-4">You can add some notes for this transfer such as payment coffee or something</div>
        <textarea name="notes" className="border rounded-md focus:outline-gray-400 text-sm md:text-base font-normal md:font-semibold p-4 h-24 md:h-32 resize-none " placeholder="Enter Some Notes" autoComplete="off" style={{ textAlign: "start", paddingTop: "0.5rem" }} />
      </div>
      <button className="bg-blue-600 min-h-8 md:min-h-10 rounded-md md:rounded-lg text-white text-sm md:text-base font-thin tracking-wider" onClick={() => setIsModalOpen(true)}>
        Submit & Transfer
      </button>
      {isModalOpen && <EnterPinModal onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} onFailure={handleFailure} />}
      {showSuccessModal && <TransferSuccessModal onClose={() => setShowSuccessModal(false)} onTransferAgain={handleTryAgain} />}
      {showFailedModal && <TransferFailedModal onClose={() => setShowFailedModal(false)} onBackTo={handleDashboard} onTryAgain={handleTryAgain} />}
    </div>
  );
}

export default TransferDetailContainer;
