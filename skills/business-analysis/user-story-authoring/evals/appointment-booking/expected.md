## Summary

Enable signed-in patients to book, reschedule, and cancel physiotherapy
appointments online, and let front-desk staff book on a patient's behalf,
reducing call volume at peak times while preserving phone access.

## Stories

US-001
Story: As a patient, I want to see available appointment slots and book one,
so that I can secure a visit without calling the front desk.
Acceptance Criteria:
  AC-1
    Given I am signed in and viewing a clinic's availability
    When I select an open slot and confirm
    Then the slot is booked in my name
    And it no longer appears as available to other patients.
  AC-2
    Given I am signed in and two patients view the same open slot
    When I confirm the slot after it has just been taken
    Then my booking is rejected
    And I am shown the next available slots.
  AC-3
    Given I am not signed in and try to book a slot
    When I select "Book"
    Then I am prompted to sign in before the booking completes.
Priority: Must have
Dependencies: Authentication

US-002
Story: As a patient, I want to reschedule an existing appointment, so that I can
keep my booking when my plans change.
Acceptance Criteria:
  AC-1
    Given I have an upcoming appointment
    When I choose a different available slot and confirm
    Then my appointment moves to the new slot
    And the original slot is released.
  AC-2
    Given my appointment is less than 24 hours away
    When I try to reschedule
    Then I am warned a late-change policy may apply (see Open Question 1).
Priority: Should have
Dependencies: US-001

US-003
Story: As a patient, I want to cancel an appointment, so that the clinic can
offer the slot to someone else.
Acceptance Criteria:
  AC-1
    Given I have an upcoming appointment more than 24 hours away
    When I cancel it
    Then the appointment is removed
    And the slot is released with no fee.
  AC-2
    Given my appointment is less than 24 hours away
    When I cancel it
    Then I am told a late-cancellation fee may apply (see Open Question 1)
    And the cancellation still completes.
Priority: Should have
Dependencies: US-001

US-004
Story: As front-desk staff, I want to book an appointment on a patient's behalf,
so that patients who call can still be served.
Acceptance Criteria:
  AC-1
    Given I am signed in as front-desk staff with an open slot selected
    When I assign it to an identified patient
    Then the appointment is booked in that patient's name.
  AC-2
    Given the patient cannot be found in the system
    When I attempt the booking
    Then I am prompted to register the patient first.
Priority: Must have
Dependencies: US-001

## Open Questions
1. What is the exact late-cancellation/late-reschedule fee policy and its cut-off
   (finance to confirm)?
2. Can a patient hold more than one upcoming appointment per clinic at a time?
3. How far in advance can a slot be booked?

## Out of Scope
- SMS appointment reminders (Won't have, this time — candidate for a later phase).
- Booking for patients who are not signed in (beyond the sign-in prompt).
- Online payment of any cancellation fee.
