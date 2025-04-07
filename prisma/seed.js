import { PrismaClient } from '@prisma/client';
// Remove the import of createEvent since we'll use Prisma directly
// import { createEvent } from '../src/actions/event-actions'

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Running seed script...');

        // Create two default venues
        const venue1 = await prisma.venue.create({
            data: {
                name: 'Bahnhof Pauli',
                capacity: 450,
            }
        });

        const venue2 = await prisma.venue.create({
            data: {
                name: 'Tranzit',
                capacity: 450,
            }
        });

        console.log('Created default venues:', venue1.id, venue2.id);

        // Create some sample events with default guestlists
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        
        const nextWeekDate = new Date();
        nextWeekDate.setDate(nextWeekDate.getDate() + 7);
        
        // Create events with nested guestlists
        const event1 = await prisma.event.create({
            data: {
                name: 'Konzert',
                venueId: venue1.id,
                eventDate: tomorrowDate,
                guestLists: {
                    create: {
                        name: 'Default Guest List',
                        maxCapacity: 50
                    }
                }
            }
        });
        
        const event2 = await prisma.event.create({
            data: {
                name: 'Konzert',
                venueId: venue2.id,
                eventDate: nextWeekDate,
                guestLists: {
                    create: {
                        name: 'Default Guest List',
                        maxCapacity: 50
                    }
                }
            }
        });

        console.log('Created sample events with default guestlists:', event1.id, event2.id);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 
