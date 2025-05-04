import React, { useState } from 'react';

function DisplayT() {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    address1: '',
    city: '',
    zip: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    amount: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === 'fullName' || name === 'city') {
      value = rawValue.replace(/[^A-Za-z ]/g, '');
    } else if (name === 'contactNumber') {
      value = rawValue.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'zip') {
      value = rawValue.replace(/\D/g, '').slice(0, 5);
    } else if (name === 'cardNumber') {
      value = rawValue.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'expMonth') {
      value = rawValue.replace(/\D/g, '').slice(0, 2);
    } else if (name === 'expYear') {
      value = rawValue.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required and letters only.';
    if (formData.contactNumber.length !== 10) newErrors.contactNumber = 'Contact number must be exactly 10 digits.';
    if (!formData.address1) newErrors.address1 = 'Address is required.';
    if (!formData.city) newErrors.city = 'City is required and letters only.';
    if (formData.zip.length !== 5) newErrors.zip = 'ZIP code must be exactly 5 digits.';

    if (paymentMethod === 'credit') {
      if (!/^\d{16}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = 'Card number must be exactly 16 digits.';
      }
      if (!/^(0[1-9]|1[0-2])$/.test(formData.expMonth)) {
        newErrors.expMonth = 'Expiration month must be between 01 and 12.';
      }
      if (!/^(202[5-9])$/.test(formData.expYear)) {
        newErrors.expYear = 'Year must be between 2025 and 2029.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
      // TODO: Handle actual form submission logic
    }
  };

  const styles = {
    container: {
      maxWidth: '1100px',
      margin: '2rem auto',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
      background: '#eef2f5',
      borderRadius: '12px'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#2c3e50',
      textAlign: 'center'
    },
    inputGroup: {
      marginBottom: '1.2rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 600,
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    errorText: {
      color: '#e74c3c',
      fontSize: '0.85rem',
      marginTop: '0.25rem'
    },
    row: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap'
    },
    col: {
      flex: 1,
      minWidth: '300px',
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    },
    sectionHeader: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      borderBottom: '2px solid #eee',
      paddingBottom: '0.5rem',
      color: '#2c3e50'
    },
    toggleButton: (active) => ({
      flex: 1,
      padding: '0.7rem',
      fontSize: '1rem',
      backgroundColor: active ? '#16a085' : '#bdc3c7',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    }),
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    expRow: {
      display: 'flex',
      gap: '1rem'
    },
    submit: {
      marginTop: '2rem',
      padding: '1rem 2rem',
      backgroundColor: '#2980b9',
      color: '#fff',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  };

  return (
    <form style={styles.container} onSubmit={handleSubmit} noValidate>
      <div style={styles.title}>Secure Payment</div>

      <div style={styles.row}>
        {/* Payment Info */}
        <div style={styles.col}>
          <div style={styles.sectionHeader}>Payment Info</div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Total Amount *</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="$0.00"
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              style={styles.toggleButton(paymentMethod === 'credit')}
              onClick={() => setPaymentMethod('credit')}
            >
              Credit Card
            </button>
            <button
              type="button"
              style={styles.toggleButton(paymentMethod === 'cod')}
              onClick={() => setPaymentMethod('cod')}
            >
              Cash on Delivery (COD)
            </button>
          </div>

          {paymentMethod === 'credit' && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="1234567812345678"
                />
                {errors.cardNumber && <div style={styles.errorText}>{errors.cardNumber}</div>}
              </div>

              <div style={styles.expRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Expiration Month *</label>
                  <input
                    type="text"
                    name="expMonth"
                    value={formData.expMonth}
                    onChange={handleInputChange}
                    placeholder="MM"
                    style={styles.input}
                  />
                  {errors.expMonth && <div style={styles.errorText}>{errors.expMonth}</div>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Expiration Year *</label>
                  <input
                    type="text"
                    name="expYear"
                    value={formData.expYear}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                    style={styles.input}
                  />
                  {errors.expYear && <div style={styles.errorText}>{errors.expYear}</div>}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Security Code (CVV) *</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="123"
                />
              </div>
            </>
          )}

          {paymentMethod === 'cod' && (
            <div style={{ fontSize: '1rem', color: '#555', marginTop: '1rem' }}>
              <p>
                You selected <strong>Cash on Delivery</strong>. Please keep the exact amount ready upon delivery.
              </p>
            </div>
          )}
        </div>

        {/* Billing Info */}
        <div style={styles.col}>
          <div style={styles.sectionHeader}>Billing Info</div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="John Doe"
            />
            {errors.fullName && <div style={styles.errorText}>{errors.fullName}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contact Number *</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="1234567890"
            />
            {errors.contactNumber && <div style={styles.errorText}>{errors.contactNumber}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Address *</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="123 Main Street"
            />
            {errors.address1 && <div style={styles.errorText}>{errors.address1}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="New York"
            />
            {errors.city && <div style={styles.errorText}>{errors.city}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ZIP Code *</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="10001"
            />
            {errors.zip && <div style={styles.errorText}>{errors.zip}</div>}
          </div>
        </div>
      </div>

      <button type="submit" style={styles.submit}>Submit Payment</button>
    </form>
  );
}

export default DisplayT;
