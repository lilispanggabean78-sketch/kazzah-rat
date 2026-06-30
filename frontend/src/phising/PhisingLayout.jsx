import { Routes, Route } from 'react-router-dom';
import Google from './themes/Google';
import Facebook from './themes/Facebook';
import WhatsApp from './themes/WhatsApp';

const PhisingLayout = () => {
  return (
    <Routes>
      <Route path="google" element={<Google />} />
      <Route path="facebook" element={<Facebook />} />
      <Route path="whatsapp" element={<WhatsApp />} />
    </Routes>
  );
};

export default PhisingLayout;
