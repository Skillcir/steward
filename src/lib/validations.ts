import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  capacity: z.coerce.number().int().min(1).max(1000),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type ResourceInput = z.infer<typeof resourceSchema>;

export const bookingSchema = z
  .object({
    resourceId: z.string().min(1, "Select a resource"),
    title: z.string().min(2, "Title must be at least 2 characters").max(120),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    notes: z.string().max(500).optional().or(z.literal("")),
    batch: z.string().max(50).optional().or(z.literal("")),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((data) => data.startTime > new Date(Date.now() - 60_000), {
    message: "Start time must be in the future",
    path: ["startTime"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;

export const roleAssignmentSchema = z.enum(["USER", "CUSTODIAN"]);

export const onboardingSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    dept: z.enum(["CSE", "CSE_AI", "EAC", "EEE", "ECE", "ELC", "ME", "OTHER"], {
      error: "Select a department",
    }),
    deptOther: z.string().max(100).optional().or(z.literal("")),
  })
  .refine((data) => data.dept !== "OTHER" || !!data.deptOther?.trim(), {
    message: "Please specify your department",
    path: ["deptOther"],
  });

export type OnboardingInput = z.infer<typeof onboardingSchema>;
