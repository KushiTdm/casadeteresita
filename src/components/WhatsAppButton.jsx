// src/components/WhatsAppButton.jsx
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const WhatsAppButton = ({ roomName = null }) => {
  const { language, t } = useLanguage();
  const phoneNumber = "59170675985";

  const getMessage = () => {
    if (roomName) {
      return t.whatsapp.roomMessage.replace('{roomName}', roomName);
    }
    return t.whatsapp.homeMessage;
  };

  const handleClick = () => {
    const message = encodeURIComponent(getMessage());
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110 group"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
        1
      </span>
    </button>
  );
};

export default WhatsAppButton;