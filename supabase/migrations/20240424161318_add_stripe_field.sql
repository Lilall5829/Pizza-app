alter table "public"."profiles" drop column "stripe_custom";

alter table "public"."profiles" add column "stripe_customer_id" text;


