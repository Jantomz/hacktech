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
import { EmailSubscription } from "@/components/budget/EmailSubscription";
import { DocumentProcessor } from "@/components/budget/DocumentProcessor";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BoardRecordingProcessor } from "@/components/budget/BoardRecordingProcessor";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AppLayoutWrapper>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Budget Dashboard</h1>
            <p className="text-muted-foreground">
              Interactive visualizations of your government's budget data
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
            <Button className="bg-budget-primary hover:bg-budget-primary/90" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Upload New Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
            <TabsTrigger value="temporal">Temporal</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="recordings">Board Streams</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Budget Summary */}
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
                        <p className="text-2xl font-bold">$124.5M</p>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-500">↑ 4.2%</span> from previous year
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
                        <p className="text-2xl font-bold">12</p>
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
                        <p className="text-2xl font-bold">78</p>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-500">↑ 8</span> new projects this year
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Other Charts */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Department Allocations</CardTitle>
                  <CardDescription>Budget by department</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BudgetBarChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spending Categories</CardTitle>
                  <CardDescription>Budget distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BudgetPieChart />
                </CardContent>
              </Card>

              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Budget Trends</CardTitle>
                  <CardDescription>5-year historical view</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BudgetLineChart />
                </CardContent>
              </Card>

              {/* AI-Generated Budget Analysis */}
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>AI-Generated Budget Analysis</CardTitle>
                  <CardDescription>
                    Analysis extracted using AI from budget documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartsViewer />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs like Geographic, Temporal, Documents, Recordings, Settings (no change) */}

          {/* you can keep the rest exactly the same */}
        </Tabs>
      </div>
    </AppLayoutWrapper>
  );
};

export default Dashboard;
