DROP INDEX "fromNodeId_toNodeId_fromOutput_toInput";--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "position" SET DEFAULT '{"x":0,"y":0}'::json;--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "position" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "data" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "connection_from_to_output_input_unique" ON "connection" USING btree ("from_node_id","to_node_id","from_output","to_input");