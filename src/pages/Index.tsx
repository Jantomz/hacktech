import { useNavigate } from "react-router-dom";
import { AppLayoutWrapper } from "@/components/layout/AppLayoutWrapper";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
    const navigate = useNavigate();

    return (
        <AppLayoutWrapper transparentHeader>
            {/* Hero section */}
            <section className="budget-gradient h-[90vh] relative">
                <div className="container mx-auto h-full flex flex-col justify-center items-center pt-16 px-4">
                    <div className="max-w-3xl text-center animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Atlas: Your Map to Financial Transparency
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Transform complex budget documents into clear
                            visualizations and insights that everyone can
                            understand.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-budget-primary hover:bg-white/90 text-lg px-8"
                                onClick={() => navigate("/upload")}
                            >
                                Upload Budget{" "}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/20 bg-transparent border-2 text-lg px-8"
                                onClick={() => navigate("/dashboard")}
                            >
                                Start Your Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
            </section>

            {/* Code Input Section */}
            <section className="py-16 px-4 bg-gray-100">
                <div className="container mx-auto max-w-md text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Enter Cities' Access Code
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Input a unique code to access your cities' budget
                        dashboard.
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const code = (
                                e.target as HTMLFormElement
                            ).elements.namedItem("code") as HTMLInputElement;
                            if (code.value.trim()) {
                                navigate(
                                    `/preview?userId=${code.value.trim()}`
                                );
                            }
                        }}
                    >
                        <input
                            type="text"
                            name="code"
                            placeholder="Enter your code"
                            className="w-full px-4 py-2 border rounded-md mb-4"
                            required
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="bg-budget-primary text-white hover:bg-budget-primary/90 text-lg px-8 w-full"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </section>

            {/* Features section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Understand Your City's Budget in Minutes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div
                            className="budget-card p-6 animate-fade-in-up"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <div className="w-12 h-12 rounded-full bg-budget-primary/10 flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-budget-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Interactive Visualizations
                            </h3>
                            <p className="text-muted-foreground">
                                Transform complex budget data into clear,
                                interactive charts and graphs that anyone can
                                understand.
                            </p>
                        </div>

                        <div
                            className="budget-card p-6 animate-fade-in-up"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <div className="w-12 h-12 rounded-full bg-budget-primary/10 flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-budget-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Geographic Mapping
                            </h3>
                            <p className="text-muted-foreground">
                                See exactly where money is being spent in your
                                city with detailed, interactive maps.
                            </p>
                        </div>

                        <div
                            className="budget-card p-6 animate-fade-in-up"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <div className="w-12 h-12 rounded-full bg-budget-primary/10 flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-budget-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Time Analysis
                            </h3>
                            <p className="text-muted-foreground">
                                Track how budget allocations change over time
                                with our intuitive timeline tools.
                            </p>
                        </div>

                        <div
                            className="budget-card p-6 animate-fade-in-up"
                            style={{ animationDelay: "0.4s" }}
                        >
                            <div className="w-12 h-12 rounded-full bg-budget-primary/10 flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-budget-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v10.764a1 1 0 01-1.447.894L15 18M5 18l-4.553-2.276A1 1 0 000 14.382V3.618a1 1 0 011.447-.894L6 5m0 13V5m0 0L9 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Video Integration
                            </h3>
                            <p className="text-muted-foreground">
                                Link budget data to council meeting videos for
                                complete context and transparency.
                            </p>
                        </div>

                        <div
                            className="budget-card p-6 animate-fade-in-up"
                            style={{ animationDelay: "0.5s" }}
                        >
                            <div className="w-12 h-12 rounded-full bg-budget-primary/10 flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-budget-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Simple Publishing
                            </h3>
                            <p className="text-muted-foreground">
                                Generate a shareable dashboard in minutes and
                                publish it for your community to access.
                            </p>
                        </div>

                        <div
                            className="budget-card p-6 animate-fade-in-up"
                            style={{ animationDelay: "0.6s" }}
                        >
                            <div className="w-12 h-12 rounded-full bg-budget-primary/10 flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-budget-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Community Engagement
                            </h3>
                            <p className="text-muted-foreground">
                                Allow citizens to explore and understand how
                                public funds are being used in their community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section className="bg-budget-secondary text-white py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Make Your Budget Transparent?
                    </h2>
                    <p className="text-xl mb-8 text-white/80">
                        Start building trust with your community through
                        financial transparency.
                    </p>
                    <Button
                        size="lg"
                        className="bg-budget-primary hover:bg-budget-primary/90 text-lg px-8"
                        onClick={() => navigate("/upload")}
                    >
                        Upload Your Budget{" "}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>
        </AppLayoutWrapper>
    );
};

export default Index;
