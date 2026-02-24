-- AddForeignKey
ALTER TABLE "product_requests" ADD CONSTRAINT "product_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
