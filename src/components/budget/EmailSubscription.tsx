
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface EmailSubscriptionForm {
  email: string;
}

export const EmailSubscription = () => {
  const { register, handleSubmit, reset } = useForm<EmailSubscriptionForm>();
  const { toast } = useToast();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const onSubmit = async (data: EmailSubscriptionForm) => {
    setIsSubscribing(true);
    try {
      // Here we would integrate with Supabase to store the subscription
      console.log('Subscribing email:', data.email);
      toast({
        title: "Successfully subscribed!",
        description: "You will receive budget updates at " + data.email,
      });
      reset();
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribe to Budget Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            <Button type="submit" disabled={isSubscribing}>
              Subscribe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
