
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { AppLayoutWrapper } from "@/components/layout/AppLayoutWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BudgetMap from "@/components/maps/BudgetMap";
import BudgetPieChart from "@/components/visualizations/BudgetPieChart";
import BudgetBarChart from "@/components/visualizations/BudgetBarChart";
import BudgetLineChart from "@/components/visualizations/BudgetLineChart";
import VideoSection from "@/components/VideoSection";
import { ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();

  const handlePublish = () => {
    toast({
      title: "Dashboard Published!",
      description: "Your budget dashboard is now publicly available.",
    });
  };

  return (
    <AppLayoutWrapper>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Budget Dashboard</h1>
            <p className="text-muted-foreground">Sample City Budget - Fiscal Year 2025</p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.print()}>
              Export Report
            </Button>
            <Button 
              className="bg-budget-primary hover:bg-budget-primary/90"
              onClick={handlePublish}
            >
              Publish Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="geographic">Geographic View</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="meetings">Council Meetings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BudgetPieChart />
              <BudgetBarChart />
            </div>
            
            <BudgetMap />
          </TabsContent>
          
          <TabsContent value="geographic">
            <div className="space-y-6">
              <BudgetMap />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-budget-primary/10 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">Downtown</h3>
                  <p className="text-2xl font-bold text-budget-primary mb-1">$10.5M</p>
                  <p className="text-sm text-muted-foreground">15.3% increase from 2024</p>
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Top Projects:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Downtown Revitalization</li>
                      <li>• Main Street Improvements</li>
                      <li>• Central Park Renovation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-budget-primary/10 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">North District</h3>
                  <p className="text-2xl font-bold text-budget-primary mb-1">$7.3M</p>
                  <p className="text-sm text-muted-foreground">7.4% increase from 2024</p>
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Top Projects:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• North Park Renovation</li>
                      <li>• Neighborhood Safety Initiative</li>
                      <li>• Community Pool Repairs</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-budget-primary/10 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-2">East District</h3>
                  <p className="text-2xl font-bold text-budget-primary mb-1">$7.1M</p>
                  <p className="text-sm text-muted-foreground">12.7% increase from 2024</p>
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Top Projects:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• East Side Community Center</li>
                      <li>• Library Expansion</li>
                      <li>• Bike Lane Construction</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="space-y-8">
              <BudgetLineChart />
              <BudgetBarChart />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-card rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-medium mb-4">5-Year Trend Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Public Safety</h4>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-budget-primary rounded-full w-3/4"></div>
                        <span className="text-sm font-medium">+12%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Infrastructure</h4>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-budget-primary rounded-full w-1/2"></div>
                        <span className="text-sm font-medium">+8%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Parks & Recreation</h4>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-budget-primary rounded-full w-1/4"></div>
                        <span className="text-sm font-medium">+4%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Community Services</h4>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-budget-primary rounded-full w-1/5"></div>
                        <span className="text-sm font-medium">+3%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-card rounded-lg p-6 shadow-md col-span-2">
                  <h3 className="text-lg font-medium mb-4">Budget Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Revenue Growth</h4>
                        <p className="text-sm text-muted-foreground">Overall revenue has increased by 5.2% compared to the previous fiscal year, primarily due to increased property tax collection and new business licenses.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Expense Management</h4>
                        <p className="text-sm text-muted-foreground">Despite inflation pressures, operational expenses were kept under control, with only a 3.1% increase year-over-year, below the national average for municipalities.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Capital Projects</h4>
                        <p className="text-sm text-muted-foreground">The capital budget has allocated $15.3M for major infrastructure projects, including downtown revitalization, park renovations, and the new community center.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="meetings">
            <VideoSection />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayoutWrapper>
  );
};

export default Dashboard;
