# GL Bro - Project Planning

## Project Overview
GL Bro is a guest list management system built with Next.js, featuring:
- Event management
- Venue management
- Guest list management
- User interface with dark mode support
- PostgreSQL database

## Current Architecture
- Frontend: Next.js with TypeScript
- UI: Tailwind CSS with shadcn/ui components
- Database: PostgreSQL with Prisma ORM
- State Management: Zustand
- Authentication: (To be implemented)

## Database Schema
See [ERD.md](ERD.md) for the complete Entity-Relationship Diagram of the system.

## Todo Items

### Core Features
- [ ] User Authentication
  - [ ] Login/Register system
  - [ ] Role-based access control
  - [ ] Session management

- [ ] Event Management
  - [ ] Create/Edit/Delete events
  - [ ] Event details page
  - [ ] Event calendar view
  - [ ] Event search and filtering

- [ ] Venue Management
  - [ ] Create/Edit/Delete venues
  - [ ] Venue details page
  - [ ] Venue capacity tracking

- [ ] Guest List Management
  - [ ] Create/Edit/Delete guest lists
  - [ ] Guest registration
  - [ ] Guest check-in system
  - [ ] Guest list capacity tracking
  - [ ] Guest list export functionality

- [ ] Access Code System
  - [ ] Generate and manage access codes
  - [ ] Code validation and usage tracking
  - [ ] Plus-one management
  - [ ] Code expiration handling

### Database Implementation
- [x] Update Prisma schema to match ERD
- [x] Implement database migrations
- [x] Add seed data for testing
- [ ] Set up database indexes for performance
- [ ] Implement data validation constraints
- [ ] Add database triggers for business logic

### UI/UX Improvements
- [ ] Responsive design for mobile devices
- [ ] Dashboard with key metrics
- [ ] Data visualization for event statistics
- [ ] Improved navigation and user flow
- [ ] Loading states and error handling

### Technical Debt
- [ ] Add comprehensive error handling
- [ ] Implement proper logging
- [ ] Add unit and integration tests
- [ ] Performance optimization
- [ ] Documentation

### Infrastructure
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Set up monitoring and analytics
- [ ] Database backup strategy

## Next Steps
1. Update Prisma schema to match the new ERD
2. Implement user authentication system
3. Complete event management features
4. Develop guest list management functionality
5. Add responsive design improvements
6. Set up testing infrastructure

## Notes
- Current venues: Bahnhof Pauli and Tranzit
- Using PostgreSQL for data persistence
- Dark mode support already implemented
- Basic event and venue models are in place
- New ERD created for comprehensive data model 