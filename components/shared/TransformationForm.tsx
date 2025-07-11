"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { startTransition, useState } from "react";
import { updateCredits } from "@/lib/actions/user.actions";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function TransformationForm({
  userId,
  creditBalance,
}: {
  userId: string;
  creditBalance: number;
}) {
  const [hasEnoughCredits, setHasEnoughCredits] = useState(true);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  //   onTransformHandler();
  // }

  const onTransformHandler = async (credits: number) => {
    if (creditBalance < credits) {
      setHasEnoughCredits(false);
      return;
    }
    startTransition(async () => {
      await updateCredits(userId, -credits);
      // Force router to revalidate everything
      router.refresh();
    });
  };

  return (
    <div className="flex gap-4 mt-10">
      {!hasEnoughCredits && <InsufficientCreditsModal />}
      <Button onClick={() => onTransformHandler(1)}>Use 1 Credit</Button>
      <Button onClick={() => onTransformHandler(10)}>Use 10 Credits</Button>
      <Button onClick={() => onTransformHandler(100)}>Use 100 Credits</Button>
    </div>
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    //     <FormField
    //       control={form.control}
    //       name="username"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Username</FormLabel>
    //           <FormControl>
    //             <Input placeholder="shadcn" {...field} />
    //           </FormControl>
    //           <FormDescription>
    //             This is your public display name.
    //           </FormDescription>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <Button type="submit">Submit</Button>
    //   </form>
    // </Form>
  );
}
