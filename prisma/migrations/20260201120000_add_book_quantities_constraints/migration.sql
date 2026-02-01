ALTER TABLE "Book"
    ADD CONSTRAINT "check_baseQuantity_non_negative" CHECK ("baseQuantity" >= 0),
    ADD CONSTRAINT "check_availableQuantity_valid_range" 
    CHECK ("availableQuantity" BETWEEN 0 AND "baseQuantity");