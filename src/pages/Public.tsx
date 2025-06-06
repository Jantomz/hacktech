import React, { useEffect, useState } from "react";
import { AppLayoutWrapper } from "@/components/layout/AppLayoutWrapper";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetBarChart from "@/components/visualizations/BudgetBarChart";
import BudgetPieChart from "@/components/visualizations/BudgetPieChart";
import BudgetLineChart from "@/components/visualizations/BudgetLineChart";
import ChartsViewer from "@/components/visualizations/ChartsViewer";
import { TimeScrubbingMap } from "@/components/maps/TimeScrubbingMap";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share } from "lucide-react";
import RAGBot from "@/components/budget/RAGBot";
import CountUp from "@/components/CountUp";
import { supabase } from "@/lib/supabase";

const Public = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [userId, setUserId] = useState<string>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get("userId");
        if (userIdFromUrl) {
            console.log("User ID from URL:", userIdFromUrl);
            setUserId(userIdFromUrl);
            // Perform any additional logic with the userIdFromUrl if needed
        }
    }, []);

    const getSentiment = async ({ commentMess }) => {
        try {
            const response = await fetch("/api/sentiment-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: commentMess }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch sentiment data");
            }
            const data = await response.json();
            console.log("Sentiment data:", data);
            return data;
        } catch (error) {
            console.error("Error fetching sentiment data:", error);
            return null;
        }
    };

    const [profile, setProfile] = useState({
        name: "",
        city: "",
        state: "",
        description: "",
        population: "",
        type: "",
    });
    const [message, setMessage] = useState("");

    // Fetch profile on mount
    useEffect(() => {
        setLoading(true);
        if (!userId) return;
        console.log("Fetching profile for user:", userId);
        supabase
            .from("accounts")
            .select("*")
            .eq("uid", userId)
            .single()
            .then(async ({ data, error }) => {
                console.log("Profile data:", data);
                if (data) {
                    setProfile({
                        name: data.name || "",
                        city: data.city || "",
                        state: data.state || "",
                        description: data.description || "",
                        population: data.population?.toString() || "",
                        type: data.type || "",
                    });
                } else if (!data) {
                    // No profile exists, so create one
                    console.log("No profile exists, so creating one");
                    const emptyProfile = {
                        uid: setUserId,
                        name: "",
                        city: "",
                        state: "",
                        description: "",
                        population: null,
                        type: "",
                    };
                    const { error: insertError } = await supabase
                        .from("accounts")
                        .insert([emptyProfile]);
                    if (!insertError) {
                        setProfile({
                            name: "",
                            city: "",
                            state: "",
                            description: "",
                            population: "",
                            type: "",
                        });
                    }
                }
                setLoading(false);
            });
    }, [userId]);

    const comments = [
        {
            id: 1,
            text: "This is a great initiative! Looking forward to seeing the results.",
            timestamp: "2025-04-26T11:10:04Z",
        },
        {
            id: 2,
            text: "I have some concerns about the budget allocation. Can we get more details?",
            timestamp: "2025-04-26T11:10:40Z",
        },
        {
            id: 3,
            text: "I appreciate the transparency in sharing this information. Thank you!",
            timestamp: "2025-04-26T11:10:03Z",
        },
        {
            id: 4,
            text: "Can we have a breakdown of the budget by department?",
            timestamp: "2025-04-26T11:10:02Z",
        },
        {
            id: 5,
            text: "I absolutely hate this entire budget!",
            timestamp: "2025-04-26T11:10:00Z",
        },
    ];

    const [commentSentiments, setCommentSentiments] = useState<
        Record<number, string>
    >({});

    useEffect(() => {
        const fetchSentiments = async () => {
            const sentiments: Record<number, string> = {};
            for (const comment of comments) {
                const sentimentData = await getSentiment({
                    commentMess: comment.text,
                });
                sentiments[comment.id] =
                    sentimentData?.sentiment || "Loading Sentiment...";
            }
            setCommentSentiments(sentiments);
        };

        fetchSentiments();
    }, []);

    const [budgetEntries, setBudgetEntries] = useState<
        {
            year: number;
            department: string;
            category: string;
            subcategory: string;
            amount_usd: number;
            fund_source: string;
            geographic_area: string;
            fiscal_period: string;
            purpose: string;
        }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getDocumentData = async () => {
        try {
            const response = await fetch("/api/docs-get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: userId }),
            });

            if (!response.ok) {
                throw new Error("Failed to process documents");
            }

            const data = await response.json();
            console.log("Document processing result:", data);
            setBudgetEntries(data.entries[0].budget_entries || []);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error processing documents:", error.message);
            } else {
                console.error("Error processing documents:", error);
            }
            setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
        getDocumentData();
    }, [userId]);

    return (
        <AppLayoutWrapper>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Budget Explanation for {profile.name || "User"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {profile.city && profile.state
                                ? `${profile.city}, ${profile.state}`
                                : "Location not set"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {profile.description || "No description available"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Population: {profile.population || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Type: {profile.type || "N/A"}
                        </p>
                        {/* <p className="text-muted-foreground">
                            Interactive visualizations of your government's
                            budget data
                        </p> */}
                    </div>
                    <div className="flex gap-2">
                        {/* <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button> */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const popup = document.createElement("div");
                                popup.style.position = "fixed";
                                popup.style.bottom = "20px";
                                popup.style.right = "20px";
                                popup.style.backgroundColor = "#fff";
                                popup.style.padding = "10px 20px";
                                popup.style.borderRadius = "5px";
                                popup.style.boxShadow =
                                    "0 2px 10px rgba(0, 0, 0, 0.2)";
                                popup.style.zIndex = "1000";

                                const userIdText = document.createElement("p");
                                userIdText.textContent = `User ID: ${userId}`;
                                userIdText.style.marginBottom = "10px";

                                const copyButton =
                                    document.createElement("button");
                                copyButton.textContent = "Copy User ID";
                                copyButton.style.display = "block";
                                copyButton.style.width = "100%";
                                copyButton.style.backgroundColor = "#007bff";
                                copyButton.style.color = "#fff";
                                copyButton.style.border = "none";
                                copyButton.style.padding = "5px 0";
                                copyButton.style.borderRadius = "5px";
                                copyButton.style.cursor = "pointer";
                                copyButton.style.marginBottom = "10px";

                                copyButton.onclick = () => {
                                    navigator.clipboard.writeText(userId || "");
                                    alert("User ID copied to clipboard!");
                                };

                                const closeButton =
                                    document.createElement("button");
                                closeButton.textContent = "Close";
                                closeButton.style.display = "block";
                                closeButton.style.width = "100%";
                                closeButton.style.backgroundColor = "#333";
                                closeButton.style.color = "#fff";
                                closeButton.style.border = "none";
                                closeButton.style.padding = "5px 0";
                                closeButton.style.borderRadius = "5px";
                                closeButton.style.cursor = "pointer";

                                closeButton.onclick = () => {
                                    document.body.removeChild(popup);
                                };

                                popup.appendChild(userIdText);
                                popup.appendChild(copyButton);
                                popup.appendChild(closeButton);
                                document.body.appendChild(popup);
                            }}
                        >
                            <Share className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                <Tabs
                    defaultValue={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-8">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="geographic">Geographic</TabsTrigger>
                        <TabsTrigger value="temporal">Temporal</TabsTrigger>
                        <TabsTrigger value="sentiment">
                            Community Sentiment
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Budget Summary */}
                            <Card className="col-span-full">
                                <CardHeader>
                                    <CardTitle>Budget Summary</CardTitle>
                                    <CardDescription>
                                        Fiscal Year{" "}
                                        {Math.max(
                                            ...budgetEntries.map(
                                                (entry) => entry.year
                                            )
                                        )}{" "}
                                        Budget Overview
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle className="text-sm font-medium">
                                                    Total Budget
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">
                                                    <CountUp
                                                        targetNumber={budgetEntries
                                                            .filter(
                                                                (entry) =>
                                                                    entry.year ===
                                                                    Math.max(
                                                                        ...budgetEntries.map(
                                                                            (
                                                                                e
                                                                            ) =>
                                                                                e.year
                                                                        )
                                                                    )
                                                            )
                                                            .reduce(
                                                                (sum, entry) =>
                                                                    sum +
                                                                    entry.amount_usd,
                                                                0
                                                            )}
                                                        format={true}
                                                    />
                                                </p>
                                                {budgetEntries.some(
                                                    (entry) =>
                                                        entry.year ===
                                                        Math.max(
                                                            ...budgetEntries.map(
                                                                (e) => e.year
                                                            )
                                                        ) -
                                                            1
                                                ) && (
                                                    <p className="text-xs text-muted-foreground">
                                                        <span className="text-green-500">
                                                            ↑{" "}
                                                            {(
                                                                ((budgetEntries
                                                                    .filter(
                                                                        (
                                                                            entry
                                                                        ) =>
                                                                            entry.year ===
                                                                            Math.max(
                                                                                ...budgetEntries.map(
                                                                                    (
                                                                                        e
                                                                                    ) =>
                                                                                        e.year
                                                                                )
                                                                            )
                                                                    )
                                                                    .reduce(
                                                                        (
                                                                            sum,
                                                                            entry
                                                                        ) =>
                                                                            sum +
                                                                            entry.amount_usd,
                                                                        0
                                                                    ) -
                                                                    budgetEntries
                                                                        .filter(
                                                                            (
                                                                                entry
                                                                            ) =>
                                                                                entry.year ===
                                                                                Math.max(
                                                                                    ...budgetEntries.map(
                                                                                        (
                                                                                            e
                                                                                        ) =>
                                                                                            e.year
                                                                                    )
                                                                                ) -
                                                                                    1
                                                                        )
                                                                        .reduce(
                                                                            (
                                                                                sum,
                                                                                entry
                                                                            ) =>
                                                                                sum +
                                                                                entry.amount_usd,
                                                                            0
                                                                        )) /
                                                                    budgetEntries
                                                                        .filter(
                                                                            (
                                                                                entry
                                                                            ) =>
                                                                                entry.year ===
                                                                                Math.max(
                                                                                    ...budgetEntries.map(
                                                                                        (
                                                                                            e
                                                                                        ) =>
                                                                                            e.year
                                                                                    )
                                                                                ) -
                                                                                    1
                                                                        )
                                                                        .reduce(
                                                                            (
                                                                                sum,
                                                                                entry
                                                                            ) =>
                                                                                sum +
                                                                                entry.amount_usd,
                                                                            0
                                                                        )) *
                                                                100
                                                            ).toFixed(1)}
                                                            %
                                                        </span>{" "}
                                                        from previous year
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle className="text-sm font-medium">
                                                    Categories
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">
                                                    <CountUp
                                                        targetNumber={
                                                            new Set(
                                                                budgetEntries.map(
                                                                    (entry) =>
                                                                        entry.subcategory
                                                                )
                                                            ).size
                                                        }
                                                    />
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Top Category:{" "}
                                                    {Object.entries(
                                                        budgetEntries.reduce(
                                                            (acc, entry) => {
                                                                acc[
                                                                    entry.subcategory
                                                                ] =
                                                                    (acc[
                                                                        entry
                                                                            .subcategory
                                                                    ] || 0) +
                                                                    entry.amount_usd;
                                                                return acc;
                                                            },
                                                            {} as Record<
                                                                string,
                                                                number
                                                            >
                                                        )
                                                    ).sort(
                                                        (a, b) => b[1] - a[1]
                                                    )[0]?.[0] || "N/A"}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle className="text-sm font-medium">
                                                    Funding Reasons
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">
                                                    <CountUp
                                                        targetNumber={
                                                            new Set(
                                                                budgetEntries.map(
                                                                    (entry) =>
                                                                        entry.purpose
                                                                )
                                                            ).size
                                                        }
                                                    />
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Purposes
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Other Charts */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>
                                        Department Allocations
                                    </CardTitle>
                                    <CardDescription>
                                        Budget by department
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <BudgetBarChart />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Spending Categories</CardTitle>
                                    <CardDescription>
                                        Budget distribution
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <BudgetPieChart />
                                </CardContent>
                            </Card>

                            <Card className="col-span-full">
                                <CardHeader>
                                    <CardTitle>Budget Trends</CardTitle>
                                    <CardDescription>
                                        5-year historical view
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <BudgetLineChart />
                                </CardContent>
                            </Card>

                            {/* AI-Generated Budget Analysis */}
                            <Card className="col-span-full">
                                <CardHeader>
                                    <CardTitle>
                                        AI-Generated Budget Analysis
                                    </CardTitle>
                                    <CardDescription>
                                        Analysis extracted using AI from budget
                                        documents
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartsViewer />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="sentiment">
                        <div className="space-y-2">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="p-3 border rounded-md shadow-sm bg-muted"
                                >
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            comment.timestamp
                                        ).toLocaleString()}
                                    </p>
                                    <p className="mt-1 text-sm">
                                        {comment.text}
                                    </p>
                                    <span
                                        className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${
                                            commentSentiments[comment.id] ===
                                            "Positive"
                                                ? "bg-green-100 text-green-800"
                                                : commentSentiments[
                                                      comment.id
                                                  ] === "Negative"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {commentSentiments[comment.id] ||
                                            "Unknown"}
                                    </span>
                                </div>
                            ))}
                            <div className="mt-2">
                                <input
                                    type="text"
                                    placeholder="Add your comment..."
                                    className="w-full p-2 border rounded-md text-sm"
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            const newComment = {
                                                id: comments.length + 1,
                                                text: e.currentTarget.value,
                                                timestamp:
                                                    new Date().toISOString(),
                                            };
                                            comments.push(newComment);
                                            const sentimentData =
                                                await getSentiment({
                                                    commentMess:
                                                        newComment.text,
                                                });
                                            setCommentSentiments((prev) => ({
                                                ...prev,
                                                [newComment.id]:
                                                    sentimentData?.sentiment ||
                                                    "Unknown",
                                            }));
                                            e.currentTarget.value = "";
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="geographic">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>
                                    Geographic Budget Distribution
                                </CardTitle>
                                <CardDescription>
                                    Interactive map with time scrubbing
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[600px]">
                                <TimeScrubbingMap />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Category Breakdown</CardTitle>
                                <CardDescription>
                                    Budget allocation by category
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-[calc(100vh-500px)] overflow-y-auto space-y-4">
                                    {Object.entries(
                                        budgetEntries.reduce((acc, entry) => {
                                            acc[entry.subcategory] =
                                                (acc[entry.subcategory] || 0) +
                                                entry.amount_usd;
                                            return acc;
                                        }, {} as Record<string, number>)
                                    )
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([subcategory, amount]) => (
                                            <div
                                                key={subcategory}
                                                className="flex justify-between items-center p-3 bg-muted rounded-lg shadow-sm"
                                            >
                                                <div>
                                                    <p className="font-semibold text-primary">
                                                        {subcategory}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Budget allocation
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg text-secondary">
                                                        $
                                                        {amount
                                                            .toFixed(0)
                                                            .replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                ","
                                                            )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="temporal">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="col-span-full">
                                <CardHeader>
                                    <CardTitle>Budget Evolution</CardTitle>
                                    <CardDescription>
                                        Year-over-year changes in major spending
                                        categories
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <BudgetLineChart />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Spending Velocity</CardTitle>
                                    <CardDescription>
                                        Monthly expenditure rate
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <BudgetBarChart />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Fiscal Calendar</CardTitle>
                                    <CardDescription>
                                        Key budget milestones and events
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                date: "Jan 15, 2024",
                                                event: "Budget Planning Begins",
                                                status: "Completed",
                                            },
                                            {
                                                date: "Mar 5, 2024",
                                                event: "Department Submissions Due",
                                                status: "Completed",
                                            },
                                            {
                                                date: "Apr 20, 2024",
                                                event: "Public Budget Hearings",
                                                status: "Completed",
                                            },
                                            {
                                                date: "Jun 1, 2024",
                                                event: "Budget Approval",
                                                status: "Completed",
                                            },
                                            {
                                                date: "Jul 1, 2024",
                                                event: "Fiscal Year Begins",
                                                status: "In Progress",
                                            },
                                            {
                                                date: "Oct 15, 2024",
                                                event: "Q1 Budget Review",
                                                status: "Upcoming",
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start"
                                            >
                                                <div
                                                    className={`h-4 w-4 rounded-full mt-1 mr-3 ${
                                                        item.status ===
                                                        "Completed"
                                                            ? "bg-green-500"
                                                            : item.status ===
                                                              "In Progress"
                                                            ? "bg-blue-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                                <div>
                                                    <p className="font-medium">
                                                        {item.event}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.date}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <RAGBot />
        </AppLayoutWrapper>
    );
};

export default Public;
