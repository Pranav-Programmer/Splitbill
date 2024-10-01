// components/Layout.js
import Link from 'next/link';
import '@/pages/app.css'
import MobileNavigationMenu from '@/components/MobileNavigationMenu/MobileNavigationMenu';

export default function Layout({ children }) {
  return (
    <>
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto">
        </div>
      </header>
      
      <main style={{marginBottom:'3.8rem'}} className="flex-1 container mx-auto p-4">{children}</main>
      <div> 
        <div className='Mob_Nav' style={{display:'fixed', position:'fixed', bottom:'0', left:'0', width:'100%'}}>
        <MobileNavigationMenu />
        </div>
        </div>
    </div>
    </>
  );
}
