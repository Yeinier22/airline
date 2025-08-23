import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import styles from './PaymentForm.module.css';

// This is Stripe's test publishable key - safe to use in frontend
// In production, you would use environment variables
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const PaymentForm = ({ amount, currency = 'USD', onSuccess, onError, passengerData, flightData }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        amount={amount} 
        currency={currency} 
        onSuccess={onSuccess} 
        onError={onError}
        passengerData={passengerData}
        flightData={flightData}
      />
    </Elements>
  );
};

const CheckoutForm = ({ amount, currency, onSuccess, onError, passengerData, flightData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      cardholderName: `${passengerData?.firstName} ${passengerData?.lastName}` || '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingZip: '',
      billingCountry: 'US',
      saveCard: false,
      agreeTerms: false
    }
  });

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  const handlePaymentSubmit = async (formData) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: formData.cardholderName,
        email: passengerData?.email,
        address: {
          line1: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          postal_code: formData.billingZip,
          country: formData.billingCountry,
        },
      },
    });

    if (error) {
      setPaymentError(error.message);
      setIsProcessing(false);
      onError?.(error.message);
      return;
    }

    // Simulate payment processing (in real app, you'd send to your backend)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (in real app, your backend would process with Stripe)
      const mockBookingConfirmation = {
        bookingId: `BK${Date.now()}`,
        paymentId: paymentMethod.id,
        status: 'confirmed',
        amount: amount,
        currency: currency,
        passenger: passengerData,
        flight: flightData,
        paymentMethod: {
          last4: '4242', // Mock card ending
          brand: 'visa',
          type: 'card'
        },
        bookedAt: new Date().toISOString()
      };

      // Save booking to localStorage (in real app, this would be in your database)
      localStorage.setItem('bookingConfirmation', JSON.stringify(mockBookingConfirmation));
      
      setIsProcessing(false);
      onSuccess?.(mockBookingConfirmation);
      
    } catch (error) {
      setIsProcessing(false);
      setPaymentError('Payment processing failed. Please try again.');
      onError?.('Payment processing failed');
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className={styles.paymentForm}>
      <h3 className={styles.sectionTitle}>Payment Information</h3>
      
      <div className={styles.paymentSummary}>
        <div className={styles.summaryRow}>
          <span>Total Amount:</span>
          <span className={styles.totalAmount}>{formatAmount(amount)}</span>
        </div>
        <div className={styles.summaryNote}>
          💳 This is a demo checkout using Stripe test mode. Use card 4242 4242 4242 4242
        </div>
      </div>

      <form onSubmit={handleSubmit(handlePaymentSubmit)} className={styles.form}>
        
        <div className={styles.cardSection}>
          <label className={styles.cardLabel}>Card Information *</label>
          <div className={styles.cardElementContainer}>
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="cardholderName">Cardholder Name *</label>
            <input
              id="cardholderName"
              type="text"
              {...register('cardholderName', {
                required: 'Cardholder name is required'
              })}
              className={errors.cardholderName ? styles.error : ''}
            />
            {errors.cardholderName && <span className={styles.errorMessage}>{errors.cardholderName.message}</span>}
          </div>
        </div>

        <h4 className={styles.subsectionTitle}>Billing Address</h4>
        
        <div className={styles.field}>
          <label htmlFor="billingAddress">Street Address *</label>
          <input
            id="billingAddress"
            type="text"
            {...register('billingAddress', {
              required: 'Billing address is required'
            })}
            className={errors.billingAddress ? styles.error : ''}
            placeholder="123 Main Street"
          />
          {errors.billingAddress && <span className={styles.errorMessage}>{errors.billingAddress.message}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="billingCity">City *</label>
            <input
              id="billingCity"
              type="text"
              {...register('billingCity', {
                required: 'City is required'
              })}
              className={errors.billingCity ? styles.error : ''}
            />
            {errors.billingCity && <span className={styles.errorMessage}>{errors.billingCity.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="billingState">State *</label>
            <input
              id="billingState"
              type="text"
              {...register('billingState', {
                required: 'State is required'
              })}
              className={errors.billingState ? styles.error : ''}
              placeholder="FL"
            />
            {errors.billingState && <span className={styles.errorMessage}>{errors.billingState.message}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="billingZip">ZIP Code *</label>
            <input
              id="billingZip"
              type="text"
              {...register('billingZip', {
                required: 'ZIP code is required',
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: 'Invalid ZIP code format'
                }
              })}
              className={errors.billingZip ? styles.error : ''}
              placeholder="12345"
            />
            {errors.billingZip && <span className={styles.errorMessage}>{errors.billingZip.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="billingCountry">Country *</label>
            <select
              id="billingCountry"
              {...register('billingCountry', {
                required: 'Country is required'
              })}
              className={errors.billingCountry ? styles.error : ''}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
            {errors.billingCountry && <span className={styles.errorMessage}>{errors.billingCountry.message}</span>}
          </div>
        </div>

        <div className={styles.checkboxSection}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              {...register('agreeTerms', {
                required: 'You must agree to the terms and conditions'
              })}
            />
            <span className={styles.checkboxText}>
              I agree to the <button type="button" className={styles.link}>Terms and Conditions</button> and <button type="button" className={styles.link}>Privacy Policy</button> *
            </span>
          </label>
          {errors.agreeTerms && <span className={styles.errorMessage}>{errors.agreeTerms.message}</span>}
        </div>

        <div className={styles.checkboxSection}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              {...register('saveCard')}
            />
            <span className={styles.checkboxText}>
              Save this card for future bookings (optional)
            </span>
          </label>
        </div>

        {paymentError && (
          <div className={styles.paymentError}>
            ❌ {paymentError}
          </div>
        )}

        <button 
          type="submit" 
          className={styles.payButton}
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className={styles.spinner}></span>
              Processing Payment...
            </>
          ) : (
            <>
              🔒 Pay {formatAmount(amount)}
            </>
          )}
        </button>

        <div className={styles.securityNote}>
          <p>🔐 Your payment information is encrypted and secure</p>
          <p>💳 Test card: 4242 4242 4242 4242 | Any future date | Any 3-digit CVC</p>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
