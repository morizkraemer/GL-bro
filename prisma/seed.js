import { PrismaClient } from '@prisma/client';

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

        // Create some sample events
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);

        const nextWeekDate = new Date();
        nextWeekDate.setDate(nextWeekDate.getDate() + 7);

        await prisma.event.create({
            data: {
                name: 'Konzert',
                venueId: venue1.id,
                eventDate: tomorrowDate
            }
        });

        await prisma.event.create({
            data: {
                name: 'Entrance',
                venueId: venue2.id,
                eventDate: nextWeekDate
            }
        });

        console.log('Created sample events');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 
