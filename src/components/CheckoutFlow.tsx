import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, CreditCard, ChevronDown, CheckCircle, ShieldCheck, Mail, MapPin, ListChecks, Ticket, Smartphone, RefreshCw } from 'lucide-react';
import { Address } from '../types';

export const CheckoutFlow: React.FC = () => {
  const {
    cart,
    cartTotal,
    currentUser,
    loginAsUser,
    placeOrder,
    selectedOrderSuccess,
    clearOrderSuccess,
    navigateTo,
  } = useApp();

  // If cart is empty and no order success yet, redirect to PLP
  useEffect(() => {
    if (cart.length === 0 && !selectedOrderSuccess) {
      navigateTo('plp');
    }
  }, [cart, selectedOrderSuccess]);

  // Accordion Step tracking
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Step 1: Login Form
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Step 2: Address Form
  const [address, setAddress] = useState<Address>({
    fullName: currentUser?.fullName || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof Address, string>>>({});

  // Step 4: Payments
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  // Automatic fill when currentUser switches
  useEffect(() => {
    if (currentUser) {
      setEmailInput(currentUser.email);
      setAddress(prev => ({ ...prev, fullName: currentUser.fullName }));
      markStepComplete(1);
      setActiveStep(2);
    }
  }, [currentUser]);

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setLoginError('Please specify a valid email address');
      return;
    }
    if (!passwordInput) {
      setLoginError('Please enter your password');
      return;
    }
    setLoginError('');
    setLoginSubmitting(true);
    const error = await loginAsUser(emailInput.trim(), passwordInput);
    setLoginSubmitting(false);
    if (error) {
      setLoginError(error);
      return;
    }
    setPasswordInput('');
    markStepComplete(1);
    setActiveStep(2);
  };

  const validateAddress = (): boolean => {
    const errorMap: Partial<Record<keyof Address, string>> = {};
    if (!address.fullName.trim()) errorMap.fullName = 'Dispaly name is required';
    if (!address.phone.trim() || address.phone.length < 8) errorMap.phone = 'Specify a valid phone number';
    if (!address.addressLine.trim()) errorMap.addressLine = 'Street address is required';
    if (!address.city.trim()) errorMap.city = 'City location is required';
    if (!address.state.trim()) errorMap.state = 'State / Division is required';
    if (!address.zipCode.trim() || isNaN(Number(address.zipCode))) errorMap.zipCode = 'Specify a numeric zip code';

    setAddressErrors(errorMap);
    return Object.keys(errorMap).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      markStepComplete(2);
      setActiveStep(3);
    }
  };

  const handleOrderSummaryVerify = () => {
    markStepComplete(3);
    setActiveStep(4);
  };

  const validatePayment = (): boolean => {
    const errorMap: Record<string, string> = {};
    if (paymentMethod === 'card') {
      if (cardDetails.number.replace(/\s/g, '').length !== 16) errorMap.number = 'Card number must be 16 digits';
      if (!cardDetails.expiry.includes('/') || cardDetails.expiry.length !== 5) errorMap.expiry = 'Expiry must be MM/YY';
      if (cardDetails.cvv.length !== 3) errorMap.cvv = 'CVV must be 3 digits';
      if (!cardDetails.name.trim()) errorMap.name = 'Cardholder name is required';
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) errorMap.upi = 'Please enter a valid UPI ID (e.g. user@okhdfc)';
    }
    setPaymentErrors(errorMap);
    return Object.keys(errorMap).length === 0;
  };

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      const activeMethodLabel =
        paymentMethod === 'card' ? 'Credit/Debit Card' :
        paymentMethod === 'upi' ? `UPI ID: ${upiId}` : 'Cash on Delivery';

      await placeOrder(address, activeMethodLabel);
    }
  };

  // Helper formatting for CC numbers
  const handleCardNumberChange = (value: string) => {
    const formatted = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (value: string) => {
    const clean = value.replace(/\D/g, '');
    let formatted = clean;
    if (clean.length > 2) {
      formatted = `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    setCardDetails(prev => ({ ...prev, expiry: formatted.slice(0, 5) }));
  };

  // Cost estimates
  const subtotal = cartTotal;
  const discount = subtotal > 200 ? 30 : subtotal > 100 ? 15 : 0;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const deliveryFee = subtotal > 150 ? 0 : 15;
  const totalVal = Number((subtotal - discount + tax + deliveryFee).toFixed(2));

  // RENDER TRANSACTION OUTCOME SUCCESS SCREEN IF VALIDATED
  if (selectedOrderSuccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center select-none font-sans" id="checkout-success-view">
        <div className="inline-flex p-3 bg-emerald-500/10 rounded-full text-emerald-600 mb-6 border border-emerald-400/40 animate-pulse">
          <CheckCircle size={52} className="stroke-2" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-emerald-600 font-bold uppercase">ORDER CONFIRMED</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-950">Thank you for shopping</h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-sm mx-auto">
            Your transaction has processed successfully. We are preparing your premium accessories for express courier dispatch.
          </p>
        </div>

        <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-3xl p-6 text-left space-y-4">
          <div className="flex items-center justify-between text-xs pb-3.5 border-b border-neutral-100">
            <span className="text-neutral-400 uppercase font-semibold tracking-wider font-mono">Invoice Reference</span>
            <span className="font-mono text-neutral-900 font-extrabold text-sm">{selectedOrderSuccess.id}</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="text-neutral-400 uppercase font-semibold tracking-wider block font-mono">Estimated Delivery Address</span>
            <div className="text-neutral-700 space-y-0.5">
              <p className="font-bold text-neutral-900">{selectedOrderSuccess.address.fullName}</p>
              <p>{selectedOrderSuccess.address.addressLine}</p>
              <p>{selectedOrderSuccess.address.city}, {selectedOrderSuccess.address.state} {selectedOrderSuccess.address.zipCode}</p>
              <p className="font-medium text-neutral-500">Contact: {selectedOrderSuccess.address.phone}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-3.5 border-t border-neutral-100 font-bold">
            <span className="text-neutral-400 uppercase tracking-widest font-mono">Sum Settled ({selectedOrderSuccess.paymentMethod.split(':')[0]})</span>
            <span className="text-base text-neutral-900 font-sans font-bold">${selectedOrderSuccess.total}</span>
          </div>
        </div>

        <button
          onClick={() => { clearOrderSuccess(); navigateTo('plp'); }}
          className="mt-8 w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase py-3.5 rounded-full transition-all shadow hover:shadow-md active:scale-95"
          id="success-continue-shopping-btn"
        >
          Continue Curation Shopping
        </button>
      </div>
    );
  }

  // STANDARD CHECKOUT PANEL
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-24 font-sans" id="checkout-gateway-view">
      <div className="mb-6 select-none">
        <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-neutral-900">Secure Order Booking Gateway</h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light">Complete authentication, verify shipping location coordinates, and select payment options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Accordions col */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* STEP 1: LOGIN/GUEST ACCORDION */}
          <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm">
            <div
              onClick={() => setActiveStep(1)}
              className="px-5 py-4 flex items-center justify-between cursor-pointer select-none bg-neutral-50/50"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${completedSteps.includes(1) ? 'bg-emerald-500 text-white' : 'bg-neutral-900 text-white'}`}>
                  {completedSteps.includes(1) ? <Check size={12} /> : '1'}
                </span>
                <span className="text-sm font-bold text-neutral-850 flex items-center gap-2">
                  <Mail size={15} className="text-neutral-500" />
                  Account Authentication
                </span>
              </div>
              <div className="flex items-center gap-3">
                {currentUser && (
                  <span className="text-xs font-bold text-neutral-500 truncate max-w-[150px]">{currentUser.email}</span>
                )}
                <ChevronDown size={14} className={`text-neutral-400 transition-transform ${activeStep === 1 ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {activeStep === 1 && (
              <div className="p-5 border-t border-neutral-100 animate-fade-in">
                {currentUser ? (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-3">
                      <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Logged in as {currentUser.fullName}</p>
                        <p className="text-neutral-500 font-light mt-0.5">{currentUser.email} — standard role: {currentUser.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { markStepComplete(1); setActiveStep(2); }}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-lg active:scale-95 transition-all"
                    >
                      Use Active Identity
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <p className="text-xs text-neutral-500 max-w-md font-light">
                      Please sign in with your account email and password to continue to checkout.
                    </p>
                    <div className="space-y-1.5 max-w-sm">
                      <label className="text-xs font-semibold text-neutral-600 block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => { setEmailInput(e.target.value); setLoginError(''); }}
                        placeholder="buyer@example.com"
                        className="w-full bg-white text-xs border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800 shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5 max-w-sm">
                      <label className="text-xs font-semibold text-neutral-600 block">Password</label>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => { setPasswordInput(e.target.value); setLoginError(''); }}
                        placeholder="••••••••"
                        className="w-full bg-white text-xs border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800 shadow-sm"
                      />
                      {loginError && <span className="text-[10px] text-rose-500 font-bold block mt-1">{loginError}</span>}
                    </div>
                    <button
                      type="submit"
                      disabled={loginSubmitting}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded-lg active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loginSubmitting ? 'Signing In…' : 'Authenticate and Continue'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: DELIVERY ADDRESS ACCORDION */}
          <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm">
            <div
              onClick={() => { if (completedSteps.includes(1)) setActiveStep(2); }}
              className={`px-5 py-4 flex items-center justify-between cursor-pointer select-none bg-neutral-50/50 ${!completedSteps.includes(1) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${completedSteps.includes(2) ? 'bg-emerald-500 text-white' : 'bg-neutral-900 text-white'}`}>
                  {completedSteps.includes(2) ? <Check size={12} /> : '2'}
                </span>
                <span className="text-sm font-bold text-neutral-855 flex items-center gap-2">
                  <MapPin size={15} className="text-neutral-500" />
                  Courier Delivery Address
                </span>
              </div>
              <ChevronDown size={14} className={`text-neutral-400 transition-transform ${activeStep === 2 ? 'rotate-180' : ''}`} />
            </div>

            {activeStep === 2 && completedSteps.includes(1) && (
              <form onSubmit={handleAddressSubmit} className="p-5 border-t border-neutral-100 space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Full Name */}
                  <div className="space-y-1.5 col-span-1 sm:col-span-2">
                    <label className="font-semibold text-neutral-600 block">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Jane Harrison Doe"
                      className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800"
                    />
                    {addressErrors.fullName && <span className="text-[10px] text-rose-500">{addressErrors.fullName}</span>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-600 block">Telephone Number</label>
                    <input
                      type="text"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 942-1428"
                      className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800"
                    />
                    {addressErrors.phone && <span className="text-[10px] text-rose-500">{addressErrors.phone}</span>}
                  </div>

                  {/* Address Line */}
                  <div className="space-y-1.5 col-span-1 sm:col-span-2">
                    <label className="font-semibold text-neutral-600 block">Street Address Details</label>
                    <input
                      type="text"
                      required
                      value={address.addressLine}
                      onChange={(e) => setAddress(prev => ({ ...prev, addressLine: e.target.value }))}
                      placeholder="842 Primrose Lane, Apt 4C"
                      className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800"
                    />
                    {addressErrors.addressLine && <span className="text-[10px] text-rose-500">{addressErrors.addressLine}</span>}
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-600 block">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Portland"
                      className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800"
                    />
                    {addressErrors.city && <span className="text-[10px] text-rose-500">{addressErrors.city}</span>}
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-600 block">State / Region</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="Oregon"
                      className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800"
                    />
                    {addressErrors.state && <span className="text-[10px] text-rose-500">{addressErrors.state}</span>}
                  </div>

                  {/* Zip Code */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-600 block">Postal ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={address.zipCode}
                      onChange={(e) => setAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="97201"
                      className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800"
                    />
                    {addressErrors.zipCode && <span className="text-[10px] text-rose-500">{addressErrors.zipCode}</span>}
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-600 block">Country Location</label>
                    <select
                      value={address.country}
                      onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-800 h-[38px] cursor-pointer font-semibold text-xs"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded-lg active:scale-95 transition-all"
                  id="checkout-shipping-submit-btn"
                >
                  Verify Address & Continue
                </button>
              </form>
            )}
          </div>

          {/* STEP 3: ORDER SUMMARY ACCORDION */}
          <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm">
            <div
              onClick={() => { if (completedSteps.includes(2)) setActiveStep(3); }}
              className={`px-5 py-4 flex items-center justify-between cursor-pointer select-none bg-neutral-50/50 ${!completedSteps.includes(2) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${completedSteps.includes(3) ? 'bg-emerald-500 text-white' : 'bg-neutral-900 text-white'}`}>
                  {completedSteps.includes(3) ? <Check size={12} /> : '3'}
                </span>
                <span className="text-sm font-bold text-neutral-855 flex items-center gap-2">
                  <ListChecks size={15} className="text-neutral-500" />
                  Order Summary Review
                </span>
              </div>
              <ChevronDown size={14} className={`text-neutral-400 transition-transform ${activeStep === 3 ? 'rotate-180' : ''}`} />
            </div>

            {activeStep === 3 && completedSteps.includes(2) && (
              <div className="p-5 border-t border-neutral-100 space-y-4 animate-fade-in" id="checkout-summary-items">
                <div className="divide-y divide-neutral-100 max-h-[300px] overflow-y-auto pr-1 no-scrollbar space-y-3 pb-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center pt-3 first:pt-0">
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-150 flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="text-[9px] font-mono font-bold uppercase text-neutral-400">{item.product.brand}</span>
                        <h4 className="font-semibold text-neutral-900 truncate">{item.product.title}</h4>
                        <p className="text-neutral-500 font-light mt-0.5">Size {item.selectedSize} | Color: {item.selectedColor.name}</p>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-semibold block font-mono">${item.product.price * item.quantity}</span>
                        <span className="text-neutral-400 block font-light">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dashed border-neutral-200">
                  <button
                    onClick={handleOrderSummaryVerify}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded-lg active:scale-95 transition-all"
                  >
                    Confirm Cart Summary
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: MOCK ACCREDITED PAYMENTS */}
          <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm">
            <div
              onClick={() => { if (completedSteps.includes(3)) setActiveStep(4); }}
              className={`px-5 py-4 flex items-center justify-between cursor-pointer select-none bg-neutral-50/50 ${!completedSteps.includes(3) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono bg-neutral-900 text-white">
                  4
                </span>
                <span className="text-sm font-bold text-neutral-855 flex items-center gap-2">
                  <CreditCard size={15} className="text-neutral-500" />
                  Premium Payment Curation
                </span>
              </div>
              <ChevronDown size={14} className={`text-neutral-400 transition-transform ${activeStep === 4 ? 'rotate-180' : ''}`} />
            </div>

            {activeStep === 4 && completedSteps.includes(3) && (
              <form onSubmit={handlePlaceOrderSubmit} className="p-5 border-t border-neutral-100 space-y-6 animate-fade-in">
                
                {/* Method Chooser */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-1.5 duration-150 relative ${paymentMethod === 'card' ? 'border-neutral-900 text-neutral-900 bg-neutral-50/50 font-bold' : 'border-neutral-250 text-neutral-500 hover:text-neutral-900'}`}
                  >
                    <CreditCard size={16} />
                    <span className="text-[10px] tracking-wide">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-1.5 duration-155 relative ${paymentMethod === 'upi' ? 'border-neutral-900 text-neutral-900 bg-neutral-50/50 font-bold' : 'border-neutral-250 text-neutral-500 hover:text-neutral-900'}`}
                  >
                    <Smartphone size={16} />
                    <span className="text-[10px] tracking-wide">UPI Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-1.5 duration-155 relative ${paymentMethod === 'cod' ? 'border-neutral-900 text-neutral-900 bg-neutral-50/50 font-bold' : 'border-neutral-250 text-neutral-500 hover:text-neutral-900'}`}
                  >
                    <RefreshCw size={16} />
                    <span className="text-[10px] tracking-wide">Cash on Delivery</span>
                  </button>
                </div>

                {/* Sub Forms Render */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 text-xs">
                    {/* Holder */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-600 block">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Jane Harrison Doe"
                        className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-850"
                      />
                    </div>

                    {/* Number */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-600 block">Card Digit String</label>
                      <input
                        type="text"
                        required
                        value={cardDetails.number}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="4125 9841 8421 9842"
                        className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-850 font-mono tracking-wider"
                      />
                      {paymentErrors.number && <span className="text-[10px] text-rose-500 font-bold block">{paymentErrors.number}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Expiry */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-600 block">Expiry Expiration</label>
                        <input
                          type="text"
                          required
                          value={cardDetails.expiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-850 font-mono"
                        />
                        {paymentErrors.expiry && <span className="text-[10px] text-rose-500 font-bold block">{paymentErrors.expiry}</span>}
                      </div>

                      {/* CVV */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-600 block">Security CVV</label>
                        <input
                          type="password"
                          required
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                          placeholder="..."
                          className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-850 font-mono"
                        />
                        {paymentErrors.cvv && <span className="text-[10px] text-rose-500 font-bold block">{paymentErrors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-1.5 text-xs">
                    <label className="font-semibold text-neutral-600 block">UPI Virtual Payment handle</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="hasiburshafin@okhdfcbank"
                      className="w-full bg-white border border-neutral-200 outline-none p-3 rounded-lg focus:border-amber-500 text-neutral-850 font-mono"
                    />
                    {paymentErrors.upi && <span className="text-[10px] text-rose-500 font-bold block">{paymentErrors.upi}</span>}
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-amber-50 border border-amber-250 text-amber-900 rounded-xl text-xs space-y-1">
                    <p className="font-bold">Cash on Delivery Selected</p>
                    <p className="text-neutral-500 font-light leading-relaxed">
                      Pay easily via mobile code scanner, tap debit cards, or hard cash upon express package courier arrival to your doorstep. An extra $5 COD process fee may apply on selected regions.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow active:scale-95 duration-200 flex items-center justify-center gap-2 leading-none"
                  id="checkout-trigger-place-order"
                >
                  Confirm and Authorize Payment
                </button>
              </form>
            )}
          </div>

        </div>

        {/* ORDER RECEIPT PRICE CARD - desktop sticky right */}
        <div className="lg:col-span-4 bg-white/75 backdrop-blur-xl border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-5 select-none">
          <h3 className="text-sm font-bold text-neutral-900 tracking-wide font-mono uppercase pb-3 border-b border-neutral-100">Booking Summary</h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-500">
              <span>Shopping Cart Subtotal</span>
              <span className="font-mono">${subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-600">
                <span>Auto Volume Discounts</span>
                <span className="font-mono">-${discount}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-neutral-500">
              <span>VAT / Luxury taxes (8%)</span>
              <span className="font-mono">${tax}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>Express Courier Delivery</span>
              <span className="font-mono">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee}`}</span>
            </div>
          </div>

          {/* Secure coupon layout */}
          <div className="pt-4 border-t border-dashed border-neutral-200 flex gap-2">
            <input
              type="text"
              disabled
              placeholder="AURA_COMP50"
              className="flex-1 bg-neutral-100 text-[10px] text-neutral-505 border border-dashed border-neutral-300 rounded px-2 outline-none font-mono font-bold self-center h-8"
            />
            <button
              onClick={() => {}}
              disabled
              className="text-[10px] bg-neutral-200 text-neutral-500 px-3 cursor-not-allowed font-semibold h-8 rounded shrink-0 uppercase"
            >
              Applied
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 font-bold text-sm sm:text-base">
            <span className="text-neutral-900">Total Sum Value</span>
            <span className="text-neutral-950 font-mono font-extrabold">${totalVal}</span>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-3.5 flex items-start gap-2.5 text-[11px] text-neutral-500 font-light leading-relaxed">
            <ShieldCheck size={16} className="text-amber-500 flex-shrink-0" />
            <span>Structured through certified SSL high-frequency handshakes. Secure credentials guarantee.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
