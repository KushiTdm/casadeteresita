import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const ContactForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('success');
    setTimeout(() => {
      setStatus('');
      setFormData({
        name: '',
        email: '',
        checkIn: '',
        checkOut: '',
        message: ''
      });
    }, 3000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(t.whatsapp.homeMessage);
    const url = `https://wa.me/59176543210?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-[#F8F5F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-5xl font-bold text-[#2D5A4A] text-center mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.contact.title}
        </h2>
        <p className="text-center text-gray-600 text-lg mb-12">
          {t.contact.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t.contact.name}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A85C32] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t.contact.email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A85C32] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t.contact.checkIn}
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A85C32] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t.contact.checkOut}
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A85C32] focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              {t.contact.message}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A85C32] focus:border-transparent resize-none"
            />
          </div>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              {t.contact.success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#A85C32] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#8B4926] transition-all duration-300 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Send className="h-5 w-5" />
            {t.contact.send}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">{t.contact.or}</p>
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#20BA5A] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
