```mermaid
erDiagram
    Venue ||--o{ Event : hosts
    Event ||--o{ GuestList : contains
    GuestList ||--o{ GuestEntry : contains
    AccessCode ||--o{ GuestEntry : used_for
    User ||--o{ Event : manages
    User ||--o{ Venue : manages
    User ||--o{ GuestList : manages
    User ||--o{ AccessCode : manages
    User ||--o{ StaffApproval : approves

    Venue {
        int id PK
        string name
        string location
        boolean is_active
    }

    Event {
        int id PK
        string name
        datetime date
        int venue_id FK
        boolean is_active
    }

    GuestList {
        int id PK
        string name
        int event_id FK
        enum type "admin-only" | "self-serve" | "approval-required"
        int max_capacity
        int current_capacity
        boolean is_closed
        datetime created_at
        datetime updated_at
    }

    AccessCode {
        int id PK
        string code
        enum target_type "guest_list" | "event" | "venue"
        int target_id
        int max_entries
        int max_entries_per_use
        boolean is_reusable
        boolean is_one_time
        datetime expires_at
        int created_by FK
        datetime created_at
    }

    GuestEntry {
        int id PK
        int guest_list_id FK
        string name
        string plus_one_name
        int added_via_code_id FK
        boolean is_checked_in
        datetime check_in_time
        datetime created_at
    }

    User {
        int id PK
        string email
        string role "admin"
        datetime created_at
    }

    StaffApproval {
        int id PK
        int guest_entry_id FK
        int approved_by FK
        datetime approved_at
        string notes
    }
} 