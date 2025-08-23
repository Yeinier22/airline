import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './PassengerForm.module.css';

// Lista de códigos de país reales
const COUNTRY_CODES = [
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+1', country: 'CA', name: 'Canada' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+33', country: 'FR', name: 'France' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+34', country: 'ES', name: 'Spain' },
  { code: '+39', country: 'IT', name: 'Italy' },
  { code: '+81', country: 'JP', name: 'Japan' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+52', country: 'MX', name: 'Mexico' },
  { code: '+55', country: 'BR', name: 'Brazil' },
  { code: '+54', country: 'AR', name: 'Argentina' },
  { code: '+61', country: 'AU', name: 'Australia' },
];

const PassengerForm = ({ onSubmit, defaultValues = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phoneCountryCode: '+1',
      phoneNumber: '555-123-4567',
      dateOfBirth: '1990-05-15',
      passportNumber: 'P12345678',
      passportExpiry: '2030-12-31',
      nationality: 'US',
      emergencyContactName: 'Jane Smith',
      emergencyContactCountryCode: '+1',
      emergencyContactPhone: '555-987-6543',
      ...defaultValues
    }
  });

  const watchEmail = watch('email');

  return (
    <div className={styles.passengerForm}>
      <h3 className={styles.sectionTitle}>Passenger Information</h3>
      
      <div className={styles.demoNotice}>
        <p>📝 <strong>Demo Form:</strong> Some fields are pre-filled for demonstration. You can edit the highlighted fields.</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              type="text"
              {...register('firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'First name must be at least 2 characters' }
              })}
              className={errors.firstName ? styles.error : styles.editable}
            />
            {errors.firstName && <span className={styles.errorMessage}>{errors.firstName.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'Last name must be at least 2 characters' }
              })}
              className={errors.lastName ? styles.error : styles.editable}
            />
            {errors.lastName && <span className={styles.errorMessage}>{errors.lastName.message}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? styles.error : styles.editable}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">Phone Number *</label>
            <div className={styles.phoneInputGroup}>
              <select
                {...register('phoneCountryCode')}
                className={styles.countryCodeSelect}
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={`${country.code}-${country.country}`} value={country.code}>
                    {country.code} {country.name}
                  </option>
                ))}
              </select>
              <input
                id="phoneNumber"
                type="tel"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9\-()s]+$/,
                    message: 'Invalid phone number'
                  }
                })}
                className={errors.phoneNumber ? styles.error : styles.editable}
                placeholder="555-123-4567"
              />
            </div>
            {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber.message}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              className={styles.readonly}
              readOnly
              title="This field is pre-filled for demo purposes"
            />
            <span className={styles.demoLabel}>Demo data - Fixed value</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="nationality">Nationality</label>
            <select
              id="nationality"
              {...register('nationality')}
              className={styles.readonly}
              disabled
              title="This field is pre-filled for demo purposes"
            >
              <option value="US">United States</option>
            </select>
            <span className={styles.demoLabel}>Demo data - Fixed value</span>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="passportNumber">Passport Number</label>
            <input
              id="passportNumber"
              type="text"
              {...register('passportNumber')}
              className={styles.readonly}
              readOnly
              title="This field is pre-filled for demo purposes"
            />
            <span className={styles.demoLabel}>Demo data - Fixed value</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="passportExpiry">Passport Expiry</label>
            <input
              id="passportExpiry"
              type="date"
              {...register('passportExpiry')}
              className={styles.readonly}
              readOnly
              title="This field is pre-filled for demo purposes"
            />
            <span className={styles.demoLabel}>Demo data - Fixed value</span>
          </div>
        </div>

        <h4 className={styles.subsectionTitle}>Emergency Contact</h4>
        
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="emergencyContactName">Emergency Contact Name</label>
            <input
              id="emergencyContactName"
              type="text"
              {...register('emergencyContactName')}
              className={styles.readonly}
              readOnly
              title="This field is pre-filled for demo purposes"
            />
            <span className={styles.demoLabel}>Demo data - Fixed value</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
            <div className={styles.phoneInputGroup}>
              <select
                {...register('emergencyContactCountryCode')}
                className={`${styles.countryCodeSelect} ${styles.readonly}`}
                disabled
                title="This field is pre-filled for demo purposes"
              >
                <option value="+1">+1 United States</option>
              </select>
              <input
                id="emergencyContactPhone"
                type="tel"
                {...register('emergencyContactPhone')}
                className={styles.readonly}
                readOnly
                placeholder="555-987-6543"
                title="This field is pre-filled for demo purposes"
              />
            </div>
            <span className={styles.demoLabel}>Demo data - Fixed value</span>
          </div>
        </div>

        <div className={styles.confirmationNote}>
          <p>
            ✈️ <strong>Booking confirmation will be sent to:</strong> {watchEmail || 'your email address'}
          </p>
        </div>

        <button type="submit" className={styles.continueButton}>
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default PassengerForm;
