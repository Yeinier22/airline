import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookingConfirmation.module.css';

const BookingConfirmation = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const bookingData = localStorage.getItem('bookingConfirmation');
    if (bookingData) {
      setBooking(JSON.parse(bookingData));
    } else {
      // If no booking data, redirect to home
      navigate('/');
    }
    setLoading(false);
  }, [navigate]);

  const handleNewBooking = () => {
    // Clear booking data and go home
    localStorage.removeItem('bookingConfirmation');
    localStorage.removeItem('storeData');
    localStorage.removeItem('flightInformation');
    navigate('/');
  };

  const handleManageBooking = () => {
    // In a real app, this would go to a booking management page
    alert('Booking management feature would be available in a full application');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>No booking found</h2>
          <p>Please complete a booking first.</p>
          <button onClick={() => navigate('/')} className={styles.homeButton}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.confirmationCard}>
        
        {/* Success Header */}
        <div className={styles.successHeader}>
          <div className={styles.successIcon}>✈️</div>
          <h1 className={styles.successTitle}>Booking Confirmed!</h1>
          <p className={styles.successSubtitle}>
            Your flight has been successfully booked. A confirmation email has been sent to {booking.passenger?.email}
          </p>
        </div>

        {/* Booking Details */}
        <div className={styles.bookingDetails}>
          <div className={styles.bookingId}>
            <span className={styles.label}>Booking Reference:</span>
            <span className={styles.bookingReference}>{booking.bookingId}</span>
          </div>
          
          <div className={styles.bookedDate}>
            <span className={styles.label}>Booked on:</span>
            <span>{formatDate(booking.bookedAt)}</span>
          </div>
        </div>

        {/* Passenger Information */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Passenger Information</h3>
          <div className={styles.passengerInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Name:</span>
              <span>{booking.passenger?.firstName} {booking.passenger?.lastName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span>{booking.passenger?.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Phone:</span>
              <span>{booking.passenger?.phone}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Passport:</span>
              <span>{booking.passenger?.passportNumber}</span>
            </div>
          </div>
        </div>

        {/* Flight Information */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Flight Information</h3>
          <div className={styles.flightInfo}>
            {/* This would normally show detailed flight info */}
            <div className={styles.flightRoute}>
              <div className={styles.routeInfo}>
                <span className={styles.airportCode}>MIA</span>
                <span className={styles.routeArrow}>→</span>
                <span className={styles.airportCode}>LAX</span>
              </div>
              <div className={styles.routeDetails}>
                <p>Miami, FL to Los Angeles, CA</p>
                <p className={styles.flightDate}>Departure: Tomorrow at 8:00 AM</p>
              </div>
            </div>
            
            {booking.flight?.returnDate && (
              <div className={styles.flightRoute}>
                <div className={styles.routeInfo}>
                  <span className={styles.airportCode}>LAX</span>
                  <span className={styles.routeArrow}>→</span>
                  <span className={styles.airportCode}>MIA</span>
                </div>
                <div className={styles.routeDetails}>
                  <p>Los Angeles, CA to Miami, FL</p>
                  <p className={styles.flightDate}>Return: In 3 days at 6:30 PM</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Payment Information</h3>
          <div className={styles.paymentInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Amount Paid:</span>
              <span className={styles.amount}>{formatAmount(booking.amount, booking.currency)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Payment Method:</span>
              <span>{booking.paymentMethod?.brand?.toUpperCase()} ending in {booking.paymentMethod?.last4}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Payment ID:</span>
              <span className={styles.paymentId}>{booking.paymentId}</span>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className={styles.importantInfo}>
          <h4>Important Information:</h4>
          <ul>
            <li>Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights</li>
            <li>Check-in opens 24 hours before departure</li>
            <li>Ensure your passport is valid for at least 6 months beyond your travel date</li>
            <li>Review baggage allowances and restrictions on the airline's website</li>
            <li>Save this confirmation for your records</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button 
            onClick={handleManageBooking}
            className={styles.manageButton}
          >
            Manage Booking
          </button>
          <button 
            onClick={handleNewBooking}
            className={styles.newBookingButton}
          >
            Book Another Flight
          </button>
        </div>

        {/* Demo Notice */}
        <div className={styles.demoNotice}>
          <p>
            🎭 <strong>Demo Mode:</strong> This is a demonstration booking. No actual payment was processed and no real flight was booked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
