import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppLayoutWrapper } from "@/components/layout/AppLayoutWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const SignIn = () => {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const { error } = await signIn(data.email, data.password);

            if (error) {
                throw error;
            }

            toast.success("Signed in successfully");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to sign in");
        }
    };

    return (
        <AppLayoutWrapper>
            <div className="container max-w-md mx-auto py-16 px-4">
                <Card>
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 bg-budget-primary rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">
                                    B
                                </span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center">
                            Sign In
                        </CardTitle>
                        <CardDescription className="text-center">
                            Access your government budget translator dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        placeholder="your@email.gov"
                                                        className="pl-10"
                                                        autoComplete="email"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        type="password"
                                                        className="pl-10"
                                                        autoComplete="current-password"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-budget-primary hover:bg-budget-primary/90"
                                >
                                    Sign In
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-budget-primary hover:underline font-medium"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayoutWrapper>
    );
};

export default SignIn;
