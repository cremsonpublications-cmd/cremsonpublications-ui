import React from 'react';
import { ClerkProvider as ClerkProviderBase } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = 'pk_test_ZWFzeS1tYWtvLTI3LmNsZXJrLmFjY291bnRzLmRldiQ';

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

export default function ClerkProvider({ children }) {
  return (
    <ClerkProviderBase publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProviderBase>
  );
}
