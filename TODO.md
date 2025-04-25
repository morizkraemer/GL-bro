### TODOs

- [ ]  actions
    - [ ] autorization!
    - [ ] race conditions
    - [ ] transactions
        - [ ] event actions
        - [ ] guest actions 
        - [ ] guestlist actions
        - [ ] link actions
        - [ ] user actions

    - [ ] cascading deletions
        - [ ] event actions
        - [ ] guest actions
        - [ ] guestlist actions

    - [ ] pagination
        - [ ] event actions
        - [ ] guest actions 
        - [ ] guestlist actions
        - [ ] link actions

        error handling
        - [ ] event actions
        - [ ] guest actions 
        - [ ] guestlist actions
        - [ ] link actions
        - [ ] user actions

- [ ] Guestlist without max capacity
- [ ] One time link card when no links (compare size of with and without links)
- [ ] One time link card column alignment

### Core Features
- [ ] User Authentication
  - [x] Login/Register system
  - [x] Role-based access control
  - [ ] Session management

- [ ] Event Management
  - [x] Create/Edit/Delete events
  - [x] Event details page
  - [ ] Event calendar view
  - [ ] Event search and filtering

- [ ] Venue Management
  - [ ] Create/Edit/Delete venues
  - [ ] Venue details page
  - [ ] Venue capacity tracking
  - [ ] Default Guest lists on Venue Level

- [ ] Guest List Management
  - [x] Create/Edit/Delete guest lists
  - [ ] Guest registration
  - [ ] Guest check-in system
  - [x] Guest list capacity tracking
  - [ ] Guest list export functionality

- [ ] Link System
    -

### Database Implementation
- [x] Update Prisma schema to match ERD
- [x] Implement database migrations
- [x] Add seed data for testing
- [x] Set up database indexes for performance
- [ ] Implement data validation constraints
- [ ] Add database triggers for business logic

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
