import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Eye, RefreshCw, Mail, Calendar, UserCheck, ShieldAlert, LogOut } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    orders,
    loginAsUser,
    logoutUser,
    navigateTo,
  } = useApp();

  const [testEmail, setTestEmail] = useState('');

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (testEmail.trim()) {
      loginAsUser(testEmail.trim());
      setTestEmail('');
    }
  };

  // Filter orders matching currentUser's email
  const userOrders = orders.filter(
    o => o.customerEmail.toLowerCase() === (currentUser?.email || 'guest@example.com').toLowerCase()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-32 font-sans" id="profile-page">
      <div className="mb-8 select-none">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-neutral-905">My Account & Orders</h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light">Track shipping coordinates, manage active profile logins, and inspect buy records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE IDENTITY DETAILS CARD */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-6 select-none relative overflow-hidden">
          {/* Subtle gold decoration tag */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500"></div>

          {currentUser ? (
            <div className="space-y-6">
              <div className="text-center pb-5 border-b border-neutral-100 flex flex-col items-center">
                <div className="bg-neutral-100/70 border border-neutral-200 h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold text-neutral-800 shadow shadow-neutral-900/5 uppercase mb-3">
                  {currentUser.fullName.charAt(0)}
                </div>
                <h3 className="text-base font-serif font-bold text-neutral-950">{currentUser.fullName}</h3>
                
                {/* Active Role indicator */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded font-bold ${
                    currentUser.role === 'admin' ? 'bg-orange-500/10 text-orange-850' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {currentUser.role} Directory
                  </span>
                  
                  {/* Status indicator active dots */}
                  <span className="flex items-center text-[10px] text-emerald-600 bg-emerald-500/10 px-2 rounded-full font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                    Verified Live
                  </span>
                </div>
              </div>

              {/* Data fields info list */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-3 text-neutral-650">
                  <Mail size={14} className="text-neutral-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="text-neutral-400 block text-[9px] uppercase font-mono">E-mail address</span>
                    <span className="text-neutral-805 font-medium">{currentUser.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-neutral-650">
                  <Calendar size={14} className="text-neutral-400 flex-shrink-0" />
                  <div>
                    <span className="text-neutral-400 block text-[9px] uppercase font-mono">Joined date</span>
                    <span className="text-neutral-805 font-medium">{currentUser.joinedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-neutral-650">
                  <UserCheck size={14} className="text-neutral-400 flex-shrink-0" />
                  <div>
                    <span className="text-neutral-400 block text-[9px] uppercase font-mono">Account constraint Status</span>
                    <span className="text-emerald-700 font-bold block">No structural limitations</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-2">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Manage Platform DB
                  </button>
                )}
                <button
                  onClick={logoutUser}
                  className="w-full border border-neutral-250 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 hover:border-transparent text-xs font-semibold tracking-wider uppercase py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 duration-100"
                >
                  <LogOut size={13} />
                  Authorize Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center py-6">
              <ShieldAlert size={36} className="text-neutral-300 mx-auto animate-bounce" />
              <h3 className="text-sm font-bold text-neutral-800">Identity login required</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Log in using direct coordinates to verify existing orders histories or proceed to administrative tasks.
              </p>
            </div>
          )}

          {/* QUICK TESTING ACCESS IDENTITY SWITCH FIELD */}
          <div className="pt-6 border-t border-neutral-100 space-y-4 text-xs">
            <h4 className="font-semibold text-neutral-900">Switch Account / Test logins:</h4>
            <form onSubmit={handleQuickLogin} className="flex gap-2.5">
              <input
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1 bg-white text-xs border border-neutral-200 outline-none p-2.5 rounded-lg focus:border-amber-500 font-mono"
              />
              <button
                type="submit"
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-2 rounded-lg shrink-0"
              >
                Log In
              </button>
            </form>
            <p className="text-[10px] text-neutral-400 leading-normal font-light">
              Tip: Enter <strong className="text-neutral-700">hasiburshafin@gmail.com</strong> to switch straight to admin privilege mode. Under normal operations, guest logins generate automatic buyer identities.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC PURCHASE TRACKER */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-neutral-900 tracking-wide font-mono uppercase pb-3 border-b border-neutral-100">My Shipping & buy History</h3>

          {userOrders.length > 0 ? (
            <div className="space-y-5">
              {userOrders.map((ord) => (
                <div 
                  key={ord.id} 
                  className="bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200/50 rounded-2xl p-4 sm:p-5 transition-colors duration-200 space-y-4 select-none"
                  id={`user-order-tracker-${ord.id}`}
                >
                  {/* Headline item and tracking indicator status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pb-3.5 border-b border-neutral-100">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-neutral-450 block font-mono uppercase text-[9px]">Invoice Reference</span>
                      <strong className="text-neutral-900 font-mono text-sm">{ord.id}</strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400 font-mono text-[10px]">{new Date(ord.date).toLocaleDateString()}</span>
                      
                      {/* Interactive shipment tracker dot status */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-850' :
                        ord.status === 'Shipped' ? 'bg-amber-505 bg-amber-500/10 text-amber-850' : 'bg-orange-505 bg-orange-500/10 text-orange-850'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          ord.status === 'Delivered' ? 'bg-emerald-500' :
                          ord.status === 'Shipped' ? 'bg-amber-500 animate-pulse' : 'bg-orange-500'
                        }`} />
                        <span>Package Status: {ord.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Products details */}
                  <div className="space-y-3">
                    {ord.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.product.images[0]} alt={item.product.title} className="w-9 h-11 rounded object-cover flex-shrink-0" />
                        <div className="flex-1 text-xs">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-450 block">{item.product.brand}</span>
                          <h4 className="font-semibold text-neutral-900 truncate">{item.product.title}</h4>
                          <span className="text-neutral-500 font-light">Size: {item.selectedSize} | Color: {item.selectedColor.name}</span>
                        </div>
                        <div className="text-right text-xs">
                          <span className="font-bold text-neutral-900 block font-mono">${item.product.price * item.quantity}</span>
                          <span className="text-neutral-400 block font-light">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary row delivery info */}
                  <div className="pt-3.5 border-t border-dashed border-neutral-200 flex flex-col sm:flex-row justify-between gap-3 text-xs leading-relaxed text-neutral-500">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider block font-bold">Shipping Coordinates</span>
                      <p className="text-neutral-800 font-medium">{ord.address.fullName} — {ord.address.addressLine}</p>
                      <p>{ord.address.city}, {ord.address.state} {ord.address.zipCode} | Tel: {ord.address.phone}</p>
                    </div>

                    <div className="text-right sm:self-end text-neutral-900">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-440 block font-bold">Sum settled ({ord.paymentStatus})</span>
                      <span className="text-sm font-bold font-mono">${ord.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <ShoppingBag size={32} className="text-neutral-200 mb-3" />
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-750">No orders registered yet</h4>
              <p className="text-xs text-neutral-400 font-light mt-1 max-w-xs">Make your first booking checkout using cash or card to observe shipment tracking.</p>
              <button
                onClick={() => navigateTo('plp')}
                className="mt-6 bg-neutral-905 bg-neutral-900 text-white font-semibold text-xs py-2 px-5 rounded-full"
              >
                Browse Accessories Catalog
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
