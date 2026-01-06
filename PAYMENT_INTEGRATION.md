# Payment Integration Implementation

## Overview
Payment integration has been added to the BookConsultationScreen following the original app's flow.

## Changes Made

### 1. Payment Service Created
**File**: `mang/src/state/services/payment.service.ts`
- Created PaymentApi with createIntent mutation
- Handles payment intent creation with consultation details
- Integrated with Redux store

### 2. Redux Store Updated
**File**: `mang/src/state/store.ts`
- Added PaymentApi reducer
- Added PaymentApi middleware
- Payment state now managed in Redux

### 3. BookConsultationScreen Updated
**File**: `mang/src/screens/Main/BookConsultationScreen.tsx`
- Added `useCreateIntentMutation` hook
- Created `initiatePayment` function to create payment intent
- Button now triggers payment flow instead of direct booking
- Button text changed to "Proceed to Payment"
- Navigates to PayConsultation screen with payment data

### 4. PayConsultationScreen Updated
**File**: `mang/src/screens/Main/PayConsultationScreen.tsx`
- Added payment confirmation logic
- Receives payment data from BookConsultation screen
- Confirms payment and creates booking
- Shows success message and navigates to Home
- Validates payment data on mount

### 5. ParamList Updated
**File**: `mang/src/utils/ParamList.ts`
- Updated PayConsultation route to accept paymentData parameter

## Payment Flow

1. **User selects consultation details** (date, time, message, video option)
2. **User clicks "Proceed to Payment"**
   - Creates payment intent via API
   - Passes consultation details to payment service
3. **Navigates to PayConsultation screen**
   - Shows payment summary
   - Displays fees breakdown
4. **User confirms payment**
   - Creates booking with consultation details
   - Updates auth trigger to refresh data
   - Shows success message
   - Navigates to Home screen

## Required Package Installation

To complete the integration, install Stripe SDK:

```bash
cd mang
npx expo install @stripe/stripe-react-native
```

## API Endpoint Required

The backend must have this endpoint:
- `POST /payment/create-intent`
- Body: `{ amount, currency, consultationDetails }`
- Returns: `{ secret, consultationDetails }`

## Notes

- Payment service is available and integrated
- Hooks are properly imported and used
- Error handling is implemented
- Loading states are managed
- Success/failure messages are shown
- Navigation flow matches original app
