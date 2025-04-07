import { prisma } from './prisma';

// This code will be executed once when the server starts
console.log('Server initialization started...');

// Check if we have the required venues
export async function checkRequiredData() {
  try {
    // Check if venues exist
    const venuesCount = await prisma.venue.count();
    
    if (venuesCount === 0) {
      console.warn('⚠️ WARNING: No venues found in the database.');
      console.warn('Please run the seed script with: npm run db:seed');
    } else {
      console.log(`✓ Database has ${venuesCount} venues`);
    }
  } catch (error) {
    console.error('Error checking required data:', error);
  }
}

// Any other initialization tasks can be added here
export async function runStartupTasks() {
  try {
    await checkRequiredData();
    // Add more initialization tasks here
    
    console.log('Server initialization completed successfully');
  } catch (error) {
    console.error('Server initialization failed:', error);
  }
} 