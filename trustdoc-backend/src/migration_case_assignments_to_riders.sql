BEGIN;

-- TrustDoc: point delivery assignments to the dedicated riders table.

ALTER TABLE case_assignments
    DROP CONSTRAINT IF EXISTS case_assignments_rider_id_fkey;

ALTER TABLE case_assignments
    ADD CONSTRAINT case_assignments_rider_id_fkey
    FOREIGN KEY (rider_id)
    REFERENCES riders(id);

COMMIT;
