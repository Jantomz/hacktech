import React, { useState } from "react";
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
import { TimeScrubbingMap } from "@/components/maps/TimeScrubbingMap";
import { EmailSubscription } from "@/components/budget/EmailSubscription";
import { DocumentProcessor } from "@/components/budget/DocumentProcessor";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BoardRecordingProcessor } from "@/components/budget/BoardRecordingProcessor";

// TODO: Change the backend url

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <AppLayoutWrapper>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Budget Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Interactive visualizations of your government's
                            budget data
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                        <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button
                            className="bg-budget-primary hover:bg-budget-primary/90"
                            size="sm"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Upload New Data
                        </Button>
                    </div>
                </div>

                <Tabs
                    defaultValue={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-6 w-full max-w-3xl mb-8">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="geographic">Geographic</TabsTrigger>
                        <TabsTrigger value="temporal">Temporal</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="recordings">
                            Board Streams
                        </TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="col-span-full">
                                <CardHeader>
                                    <CardTitle>Budget Summary</CardTitle>
                                    <CardDescription>
                                        Fiscal Year 2024-2025 Budget Overview
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
                                                    $124.5M
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    <span className="text-green-500">
                                                        ↑ 4.2%
                                                    </span>{" "}
                                                    from previous year
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle className="text-sm font-medium">
                                                    Departments
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">
                                                    12
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Across 5 major categories
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle className="text-sm font-medium">
                                                    Projects
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">
                                                    78
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    <span className="text-green-500">
                                                        ↑ 8
                                                    </span>{" "}
                                                    new projects this year
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

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
                        </div>
                    </TabsContent>

                    <TabsContent value="geographic">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>
                                        Geographic Budget Distribution
                                    </CardTitle>
                                    <CardDescription>
                                        Interactive map with time scrubbing
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[500px]">
                                    <TimeScrubbingMap />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>District Breakdown</CardTitle>
                                    <CardDescription>
                                        Budget allocation by district
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        "Downtown",
                                        "Westside",
                                        "Eastside",
                                        "Northside",
                                        "Southside",
                                    ].map((district) => (
                                        <div
                                            key={district}
                                            className="flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {district}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Various projects
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    $
                                                    {(
                                                        Math.random() * 800000 +
                                                        200000
                                                    )
                                                        .toFixed(0)
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                        )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {Math.floor(
                                                        Math.random() * 20
                                                    ) + 5}{" "}
                                                    projects
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
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

                    <TabsContent value="documents">
                        <div className="grid grid-cols-1 gap-6">
                            <DocumentProcessor />
                        </div>
                    </TabsContent>

                    <TabsContent value="recordings">
                        <div className="grid grid-cols-1 gap-6">
                            <BoardRecordingProcessor />
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <EmailSubscription />
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Notification Preferences
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your budget update notifications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    // Additional settings can be added here
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayoutWrapper>
    );
};

export default Dashboard;
