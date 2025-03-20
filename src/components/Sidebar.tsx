import { BellPlus } from 'lucide-react';
import { AppWindowMac } from 'lucide-react';
const Sidebar = () => {
  return (
    <div className="bg-gradient-to-r from-gray-700 via-neutral-600 to-neutral-700 rounded-4xl h-[92%] p-4 mt-8 flex flex-col items-center justify-evenly">
       <BellPlus className='text-9xl '/>
       <AppWindowMac className='text-7xl'/>
       <AppWindowMac className='items-center'/>
       <AppWindowMac className='items-center'/>
       <AppWindowMac className='items-center'/>
       <AppWindowMac className='items-center'/>
       <AppWindowMac className='items-center'/>
       <AppWindowMac className='items-center'/>
       <AppWindowMac className='items-center'/>
    </div>
  );
};

export default Sidebar;
