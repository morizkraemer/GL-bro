'use client';

import { useEffect, useState } from 'react';

export function ClientInitializer() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // This code runs once on client-side initialization
    // Perfect for things that need to run in the browser but only once
    if (!initialized) {
      console.log('Client-side initialization running...');
      
      // Add any client-side initialization tasks here
      // For example:
      // - Set up analytics
      // - Initialize third-party libraries
      // - Load user preferences from localStorage
      
      // Mark as initialized so it doesn't run again
      setInitialized(true);
      console.log('Client-side initialization completed');
    }
  }, [initialized]);

  // This component doesn't render anything visible
  return null;
} 